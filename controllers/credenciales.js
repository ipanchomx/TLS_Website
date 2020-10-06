'use strict'
const bcrypt = require('bcrypt');
const saltRounds = 10;
const speakeasy = require("speakeasy");
const QRCode = require('qrcode');

let Credenciales = require('../models/credenciales');

let getCredenciales = function (req, res) {
    Credenciales.find((err, creds) => {
        if (err) {
            console.log(err);
            res.status(500).send({message : 'Server error.', error : `${err}`});
        } else {
            
            let array = [];
            creds.forEach(element => array.push(element));

            console.log(creds);
            res.status(200).send({
                message: 'Credenciales obtenidas',
                results: array
            });
        }
    });
}

let createCredencial = function (req, res) {
    let {
        email,
        password
    } = req.body;
    
    //console.log(req.body);
    
    Credenciales.findOne({email: email})
        .then(user => {
            if(!user) {
                const hash = bcrypt.hashSync(password, saltRounds);
                let actualDate = new Date();
                Credenciales.create({
                    email: email,
                    password: hash,
                    lastConnection : actualDate,
                    countLogin : 0
                }, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({message : 'Server error.', error : `${err}`});
                    } else {
                        res.status(201).send({message : 'Usuario registrado'});
                    }
                })
            }
        }
        ).catch(err => {
            console.log(err);
            res.status(500).send({message : 'Server error.', error : `${err}`});
        })

}

let getCredencial = function(req, res) {
    let {
        email,
        password
    } = req.body;

    Credenciales.findOne({email: email})
        .then(user => {
            if(user) {

                let secret = speakeasy.generateSecret({
                    name :"TLS_Website"
                });
                // Returns an object with secret.ascii, secret.hex, and secret.base32.
                // Also returns secret.otpauth_url, which we'll use later.
                console.log('El token: ',secret.ascii);
                Credenciales.findOneAndUpdate({email : user.email}, {token : secret.ascii}, function(req, res) {});

                // Get the data URL of the authenticator URL
                QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
                    res.status(200).send({url : data_url});
                });         
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send({message : 'Server error.', error : `${err}`});
        })
}

let verifyToken = function(req, res) {
    let {
        email,
        password, 
        codigo
    } = req.body;

    Credenciales.findOne({email: email})
        .then(user => {
            if(user) {                

                console.log(user);
                let tokenPage = user.token;
                // Use verify() to check the token against the secret
                let verified = speakeasy.totp.verify({ secret: tokenPage,
                    encoding: 'ascii',
                    token: codigo, 
                });
                    
                if(bcrypt.compareSync(password, user.password) && verified) {
                    console.log('Entró al if we');
                    Credenciales.findOneAndUpdate({email : user.email}, {lastConnection : new Date(), countLogin : user.countLogin + 1}, function(req, res) {
                    });

                    res.status(200).send({message :'Usuario autorizado', 
                    email : user.email
                });
                }
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send({message : 'Server error.', error : `${err}`});
        })    
}

module.exports = {
    getCredenciales,
    createCredencial,
    getCredencial,
    verifyToken
}
