'use strict';

var mongoose = require('mongoose');
var userSchema = {
        authKey:String,
        name: String
        
}
var userModel = function () { 
    var schema = mongoose.Schema(userSchema);
    schema.methods.getDomainSchema = function(){
        return userSchema
    }
    return mongoose.model('User', schema);
};

module.exports = {
    user: new userModel()
}