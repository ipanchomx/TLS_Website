'use strict'

const express = require('express');

const CredencialesController = require('../controllers/credenciales');

let api = express.Router();

api.get('/credenciales', CredencialesController.getCredenciales);

api.get('/signup', CredencialesController.createCredencial);

module.exports = api;
