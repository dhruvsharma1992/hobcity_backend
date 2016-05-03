var dto = require('./dto')
module.exports = {
    createTrip :  function(authKey,body ,next){
        if (body.hasOwnProperty('name')) {
            var trip = new dto.trip()
            trip['authKey'] = authKey
            trip['name'] = body['name']
            trip['createDate'] = (new Date()).valueOf()
            trip['positions'] = []
            //console.log(user)
            var globalDTO = trip
            trip.save(function(err){
                if(err) {
                  console.log('save error', err);
                  next(err,null)
                }
                else
                    next(null,globalDTO)
            }) 
        }
        
        else{
             next("Empty Body",null)
        }        
    } ,
    addLatLng :  function(tripId,body ,next){
        if (body.hasOwnProperty('lat') && body.hasOwnProperty('lng')) {
            dto.trip.findById( tripId,function(err,trip){
                if (err) {
                    next(err ,null)
                }
                else{
                    //console.log(user)
                    if (trip == null) {
                        //console.log("unable to authenticate")
                        next("unable to find trip",null)
                    }
                    else{
                        trip.positions.push({
                            lat: body.lat,
                            lng: body.lng,
                            timestamp: (new Date()).valueOf()
                        })
                        var globalDTO = trip
                        trip.save(function(err){
                            if(err) {
                              console.log('save error', err);
                              next(err,null)
                            }
                            else
                                next(null,trip)
                        }) 
                    }
                }
            })
                
        }        
        else{
             next("Lat Lng not given",null)
        }        
    } 
    
}
var toDomainObject = function(obj,dtoObj){
        var newObj = {}
        //console.log(dtoObj)
        console.log(dtoObj.schema)
        var schema = (new dtoObj()).getDomainSchema()
        for(var key in schema){
            newObj[key]= obj[key]// newObj
        }
        return newObj
}