const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public/js')));
app.use('/', express.static(path.join(__dirname, 'public/css')));
app.use('/', express.static(path.join(__dirname, 'public/views')));


const config = {
    cert : fs.readFileSync(path.join(__dirname, "localhost.pem")),
    key : fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
}

https.createServer(config, app).listen(8080, () => {
    console.log("Tenemos HTTPS");
})