'use strict';

var businessLayer = require('./businessLayer/logic')
module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'common/pages/index',{
        });        
    });
    router.get('/save/:userName',function(req,res){        
        res.send(businessLayer.postToDB(req.params.productName,req.params.price,req.params.userName))
    })
    router.get('/get',function(req,res){
        businessLayer.queryFromDB().then(function(users){
             res.send(users)
        })
    })
    

};
