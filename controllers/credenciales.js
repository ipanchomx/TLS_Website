'use strict'
const bcrypt = require('bcrypt');
const saltRounds = 10;
let Credenciales = require('../models/credenciales');

let getCredenciales = function(req, res) {
    Credenciales.find((err, creds) => {
        if(err) {
            console.log(err);
            res.status(500).send({message : 'Credenciales no encontradas', results : []});
        }
        else {
            let array = [];
            creds.forEach( element => array.push(element));

            console.log(creds);
            res.status(200).send({message : 'Credenciales obtenidas', results : array});
        }
    });
}

let createCredencial = function() {


    Credenciales.create({
       email : "ipanchomx@gmail.com",
       password : "123456789"
    }, (err) => {
        if(err) return console.log(err);
    })
}


module.exports = {
    getCredenciales,
    createCredencial
}