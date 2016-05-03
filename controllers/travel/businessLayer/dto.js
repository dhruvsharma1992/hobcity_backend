'use strict';

var mongoose = require('mongoose');
var positionSchema = {
        lat: Number,
        lng: Number,
        timestamp: Number
}
var tripSchema = {
        authKey:String,
        name: String,
        createDate: Number,
        positions: [positionSchema]
}
var tripModel = function () { 
    var schema = mongoose.Schema(tripSchema);
    schema.methods.getDomainSchema = function(){
        return tripSchema
    }
    return mongoose.model('Trip', tripSchema);
};

module.exports = {
    trip: new tripModel()
}