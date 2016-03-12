'use strict';

var mongoose = require('mongoose');

var productModel = function () { 
    var schema = mongoose.Schema({
        name: String,
        price: Number
    });
    return mongoose.model('Product', schema);
};

var userModel = function () { 
    var schema = mongoose.Schema({
        name: String 
        });
    return mongoose.model('User', schema);
};

module.exports = {
    product: new productModel(),
    user: new userModel()
}