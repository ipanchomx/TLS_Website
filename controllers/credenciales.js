'use strict'
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
                Credenciales.create({
                    email: email,
                    password: hash
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
/*
    console.log("Usuario a loggearse");
    console.log(req.body);*/
    Credenciales.findOne({email: email})
        .then(user => {
            if(user) {
                /*
                console.log("Usuario en base de datos");                
                console.log(user);                
                console.log(bcrypt.compareSync(password, user.password)); */
                // true
                if(bcrypt.compareSync(password, user.password)) {
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
    getCredencial
}
