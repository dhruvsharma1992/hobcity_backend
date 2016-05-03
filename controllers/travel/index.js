'use strict';
var commonBusinessLayer = require('./../businessLayer/logic')
var businessLayer = require('./businessLayer/logic')
module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'travel/pages/index',{
               'text':'Welcome to travel@hobcity' 
        });        
    });
    router.post('/createTrip/',function(req,res){
        var body= req.body
        commonBusinessLayer.checkAuthKey(req.headers,function(err,user){
             console.log(user)
             if(err){
                console.log("err "+err)
                res.statusCode = 400
                res.send({
                    'message':err,
                    'name':'Error'
                })
             }
             else{
                console.log("no err")
                businessLayer.createTrip( user.authKey , body, function(err,trip){
                     if (err) {
                        res.statusCode = 400
                        res.send({
                            'message':err,
                            'name':'Error'
                        })
                    }
                    else{
                        res.send({
                           'details':trip,
                           'name':'OK'
                       })
                    }
                })
            }
        })
    })
    router.post('/updateTrip/:tripId',function(req,res){
        var body= req.body
        var tripId = req.params .tripId
        commonBusinessLayer.checkAuthKey(req.headers,function(err,user){
             console.log(user)
             if(err){
                console.log("err "+err)
                res.statusCode = 400
                res.send({
                    'message':err,
                    'name':'Error'
                })
             }
             else{
                console.log("no err")
                businessLayer.addLatLng( tripId , body, function(err,trip){
                     if (err) {
                        res.statusCode = 400
                        res.send({
                            'message':err,
                            'name':'Error'
                        })
                    }
                    else{
                        res.send({
                           'details':trip,
                           'name':'OK'
                       })
                    }
                })
            }
        })
    })
     
     
};