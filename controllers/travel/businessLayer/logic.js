var dto = require('./dto')
var commonDto = require('./../../businessLayer/dto')
var async = require( 'async')
module.exports = {
    postToDB :  function(pName,price ,userName){
               
        commonDto.user.findOne({'name':userName }).exec().then( function(user){
            console.log('user')
            console.log(user)
            var product = new dto.product({'name':pName,'price': price})
            console.log(product)
            product.boughtBy = user 
            product.save(function(err){
                if(err) {
                  console.log('save error', err);
                  return err
                }
                console.log('product saved')
             })  
        })        
                     
        return 'success'
    },    
    queryFromDB: function(callback){
        dto.product.find({},function(err,products){
            async.eachSeries(products,
                    function(product, eachCallback){
                        product.toDAO().then(function (dao){
                          product = dao
                          eachCallback();
                        })
                    },
                    function(err){
                        console.log('products');
                        console.log(products)
                        callback(null,products)
                    }
            )
            //callback()
        })           

    },
     queryFromDB2: function(){
        console.log('entering queryFromDB')
        var promise = dto.product.find({}).exec()//e
        promise.then(function(products){
             products.forEach(function(product) {
                console.log('before then')
                return product.toDAO()
                    .then(function(dao){
                        console.log('dao logic')
                        product = dao
                    })
             })
        })
        return promise
    }
}