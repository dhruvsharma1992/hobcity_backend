'use strict';

var businessLayer = require('./businessLayer/logic')
module.exports = function (router) {
    router.get('/', function (req, res) {        
        res.render( 'common/pages/index',{
        });        
    });
    router.post('/users/authenticate/',function(req,res){        
            businessLayer.createNewUser(req.body,function(err,user){
                if (err) {
                    res.statusCode = 400
                    res.send({
                        'message':err,
                        'name':'Error'
                    })
                }
                else{
                    res.send({
                        'details':user,
                        'name':'OK'
                    })
                }
            })
       
    })
    router.get('/get',function(req,res){
        console.log(req.headers)
        businessLayer.checkAuthKey(req.headers,function(err,user){
             //console.log("err "+err)
             if(err){
                console.log("err "+err)
                res.statusCode = 400
                res.send({
                    'message':err,
                    'name':'Error'
                })
             }
             else{
                //console.log("no err")
                businessLayer.queryFromDB( function(err,users){
                     if (err) {
                        res.statusCode = 400
                        res.send({
                            'message':err,
                            'name':'Error'
                        })
                    }
                     res.send({
                        'details':users,
                        'name':'OK'
                    })
                })
            }
        })
    })
    

};
