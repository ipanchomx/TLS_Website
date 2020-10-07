'use strict'

const express = require('express');

const CredencialesController = require('../controllers/credenciales');

let api = express.Router();

api.get('/credenciales', CredencialesController.getCredenciales);

api.post('/signup', CredencialesController.createCredencial);
api.post('/login', CredencialesController.getCredencial);
api.post('/verifyToken', CredencialesController.verifyToken);
api.post('/editInfo', CredencialesController.editInfo);


module.exports = api;
