var dto = require('./dto')

module.exports = {
    /* createNewUser */
    createNewUser :  function(body,next){
        if (body.hasOwnProperty('name')) {
            var user = new dto.user()
            for(var key in body){
                user[key] = body[key]
            }
            user['authKey']=user['_id']
            console.log(user)
            var globalUser = user
            user.save(function(err){
                if(err) {
                  console.log('save error', err);
                  next(err,null)
                }
                next(null,toDomainObject(globalUser,dto.user))
            })  
        }
        else{
            next("missing property",null)                      
        }
    },    
    queryFromDB: function(next){
        //console.log('entering queryFromDB')
        dto.user.find({},function(err,users){
            if (err) {
                    next(err,null)
            }
            else{
                var newObj = []
                for(var userIndex = 0; userIndex< users.length; userIndex++)
                    newObj.push(toDomainObject(users[userIndex],dto.user))
                next(null,newObj)
            }
            
        }) 
        //return promise
    },
    default500: function(msg){
        return {
            'name':'INTERNAL_SERVICE_ERROR',
            'message':msg
        }
    },
    checkAuthKey : function(header,next){        
        if (header.hasOwnProperty('authkey')) {
            dto.user.findOne({"authKey": header.authkey},function(err,user){
                if (err) {
                    next("unable to authenticate",null)
                }
                else{
                    console.log(user)
                    if (user == null) {
                        //console.log("unable to authenticate")
                        next("unable to authenticate",null)
                    }
                    else
                        next(null,toDomainObject(user,dto.user))
                }
                
            }) 
        }
        else{
            next("unable to authenticate",null)
        }
    }
}
var toDomainObject = function(obj,dto){
        var newObj = {}
        var schema = (new dto()).getDomainSchema()
        for(var key in schema){
            newObj[key]= obj[key]// newObj
        }
        return newObj
}