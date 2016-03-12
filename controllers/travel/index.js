'use strict';
var businessLayer = require('./businessLayer/logic')
module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'travel/pages/index',{
               'text':'Welcome to travel@hobcity' 
        });        
    });
    router.get('/save',function(req,res){        
        res.send(businessLayer.postToDB())
    })
    router.get('/get',function(req,res){
        businessLayer.queryFromDB().then(function(users){
             res.send(users)
        })
        //var users = businessLayer.queryFromDB()
        //console.log('businessLayer.queryFromDB()')
        //console.log(users)
        //res.send(users)
    })
};