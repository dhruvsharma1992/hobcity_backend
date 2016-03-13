'use strict';

var mongoose = require('mongoose');

var userModel = function () { 
    var schema = mongoose.Schema({
        name: String 
        });
    return mongoose.model('User', schema);
};

module.exports = {
    user: new userModel()
}