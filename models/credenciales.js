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
    }
});


module.exports = mongoose.model("Credenciales", schema);