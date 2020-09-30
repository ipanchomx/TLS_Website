const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

let mongoose = require('mongoose');
let config = require('./config/config');
let PORT = 8080;


const app = express();

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

/*
https.createServer(config, app).listen(8080, () => {
    console.log("Tenemos HTTPS");
})
*/

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