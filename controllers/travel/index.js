'use strict';
var businessLayer = require('./businessLayer/logic')
module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'travel/pages/index',{
               'text':'Welcome to travel@hobcity' 
        });        
    });
    router.post('/save/:productName/:price/:userName',function(req,res){        
        res.send(businessLayer.postToDB(req.params.productName,req.params.price,req.params.userName))
    })
    router.get('/get',function(req,res){
        businessLayer.queryFromDB(function(err,products){
            
            res.send(products)//f
        })
        //.then(function(products){
        //     res.send(products)
        //})
    })
};