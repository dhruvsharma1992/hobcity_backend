'use strict';

var mongoose = require('mongoose');

var productModel = function () { 
    var schema = mongoose.Schema({
        name: String,
        price: Number,
        boughtBy: {
            type:mongoose.Schema.ObjectId,
            ref: 'User'
        }
    });
    
    schema.methods.toDAO = function(callback){

        var promise = this.populate('boughtBy').execPopulate()
        promise.then(function(daos){
            console.log('daos')
            console.log(daos)
            callback()           
        })
        return promise
    }
    return mongoose.model('Product', schema);
};


module.exports = {
    product: new productModel()
}