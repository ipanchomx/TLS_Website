'use strict'
const bcrypt = require('bcrypt');
const saltRounds = 10;

let Credenciales = require('../models/credenciales');

let getCredenciales = function (req, res) {
    Credenciales.find((err, creds) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Credenciales no encontradas',
                results: []
            });
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

    Credenciales.findOne({email: email})
        .then(user => {
            if(!user) {
                const hash = bcrypt.hashSync(password, saltRounds);
                Credenciales.create({
                    email: email,
                    password: hash
                }, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                })
            }
        }
        ).catch(err => {
            res.send(`error: `+ err);
        })

}

let getCredencial = function(req, res) {
    let {
        email,
        password
    } = req.body;

    console.log("Usuario a loggearse");
    console.log(req.body);
    Credenciales.findOne({email: email})
        .then(user => {
            if(user) {
                console.log("Usuario en base de datos");                
                console.log(user);                
                console.log(bcrypt.compareSync(password, user.password)); // true
            }
        })
}


module.exports = {
    getCredenciales,
    createCredencial,
    getCredencial
}