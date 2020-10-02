const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const fileUpload = require('express-fileupload');

let mongoose = require('mongoose');
let config = require('./config/config');

let PORT = 8080;


const app = express();

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

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.file;

    //console.log('sampleFile: ',sampleFile);
    //console.log('sampleFile2: ',sampleFile);
    const routeFilename = path.join(__dirname, 'uploads', sampleFile.name);

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
        }
    });
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
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("\n\n====> Connected to Mongo database!");
        https.createServer(configuration, app).listen(PORT, () => {
            console.log("====> Local Server created in https://localhost:" + PORT + "" + "\n\n");
        });
    })
    .catch(err => console.log(err));