const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const qrcode = require('qrcode');

const mongoose = require('mongoose');
const config = require('./config/config');

const PORT = 8080;

//const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
//const key = '12345678912345678912345678912345';
const key = crypto.createHash('sha256').update('123456789123456789123456789123456789ABCDEFGHI').digest('base64').substr(0, 32);

const app = express();

// Private key
const private_key = fs.readFileSync(path.join(__dirname, 'keys/privateKey.pem'), 'utf-8');

// Public key
const public_key  = fs.readFileSync(path.join(__dirname, 'keys/publicKey.pem'), 'utf-8');

// default options
app.use(fileUpload());


/* load routes */
const credencialesRoutes = require('./routes/credenciales');


/* use cors */
app.use(cors());

/* body-parser middleware */
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public/js')));
app.use('/', express.static(path.join(__dirname, 'public/css')));
app.use('/', express.static(path.join(__dirname, 'public/views')));


app.use('/api', credencialesRoutes);


const configuration = {
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
}

async function run(sig, nameDoc) {
    const res = await qrcode.toDataURL(sig);
    let arr = nameDoc.split('.');

    fs.writeFileSync(path.join(__dirname, './public/qrCodes/', `./qr${arr[0]}.html`), `<img src="${res}">`);
}           

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.file;

    const routeFilename = path.join(__dirname, 'uploads/', sampleFile.name);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(routeFilename, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: err
            });
        } else {
            res.status(201).send({
                message : 'File uploaded!',
                filename : sampleFile.name, 
                filePath : routeFilename
            });

            let data = fs.readFileSync(path.join(__dirname, 'uploads/' + sampleFile.name));
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
/*
            fs.writeFileSync(routeFilename, encrypted.toString('hex'), function(err) {
                if(err) console.log(err);
                else {
                    console.log('Replaced!');
                }
            });
*/
            fs.writeFileSync(path.join(__dirname, 'uploads/' + sampleFile.name), encrypted, function(err) {
                if(err) console.log(err);
                else {
                    console.log('Replaced!');
                }
            });
            // File/Document to be signed
            const doc = fs.readFileSync(path.join(__dirname, 'uploads/' + sampleFile.name));
            //console.log(doc)

            // Signing

            const signer = crypto.createSign('RSA-SHA256');
            signer.write(doc);
            signer.end();

            // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
            const signature = signer.sign(private_key, 'base64')

            //console.log('Digital Signature: ', signature);

            // Write signature to the file `signature.txt`
            fs.writeFileSync(path.join(__dirname, 'signatures/', sampleFile.name), signature);


            let signatureToQR = fs.readFileSync(path.join(__dirname, 'signatures/', sampleFile.name), 'utf-8');

            run(signatureToQR, sampleFile.name).catch(error => console.error(error.stack));


        }
    });

});

app.post('/verify', function(req, res) {
    const signature = fs.readFileSync(path.join(__dirname, 'signatures/'+ req.body.name), 'utf-8');

    //console.log('signature: ', signature);
    // File to be signed
    const doc = fs.readFileSync(path.join(__dirname, 'uploads/' + req.body.name));

    //console.log('doc: ', doc);

    // Signing
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(doc);
    verifier.end();

    // Verify file signature ( support formats 'binary', 'hex' or 'base64')
    const result = verifier.verify(public_key, signature, 'base64');

    console.log('Digital Signature Verification : ' + result);    

    if(result) {
        res.status(200).send({
            message : 'Verification completed!',
            status: 'OK!'
        });
    } else {
        res.status(202).send({
            message : 'Verification completed!',
            status: 'Cuidado! La firma no coincide con el archivo.'
        }); 
    }
});

app.post('/decrypt', function(req, res) {
    let data = fs.readFileSync(path.join(__dirname, 'uploads/'+ req.body.name));

    //let iv_f = Buffer.from(iv, 'hex');
    //let encryptedText = Buffer.from(data, 'hex');
    //let encryptedText = Buffer.from(data);
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    //console.log('Encrypted text: ' + encryptedText);
    //console.log('Decrypted text: ' + decrypted);

    const routeFilename = path.join(__dirname, 'decrypt/' + req.body.name);
    //console.log(routeFilename);
    fs.writeFileSync(routeFilename, decrypted, {});

    res.status(200).send({message: 'Decrypted!'});
    //console.log('Hola');
});

app.get('/getFiles', function(req, res) {
    let url = path.join(__dirname, 'uploads');
    let files = fs.readdirSync(url);
    //console.log(files);
    res.status(200).send({
        message : 'Files founded!',
        files : files,
        filepath : url
    });
});

mongoose.connect(config.DB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
    })
    .then(() => {
        console.log("\n\n====> Connected to Mongo database!");
        https.createServer(configuration, app).listen(PORT, () => {
            console.log("====> Local Server created in https://localhost:" + PORT + "" + "\n\n");
        });
    })
    .catch(err => console.log(err));