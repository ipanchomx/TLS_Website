'use strict'

const mongoose = require('mongoose');

let schema = mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    lastConnection : {
        type : Date,
        required : true
    },
    countLogin : {
        type : Number
    },
    token : {
        type : String
    }
});

module.exports = mongoose.model("Credenciales", schema);