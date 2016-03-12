var dto = require('./dto')

module.exports = {
    postToDB :  function(){
        var product = new dto.product({'name':'abcde','price': 20})
        console.log('product');
        console.log(product)
        product.save(function(err){
            if(err) {
              console.log('save error', err);
              return err
            }
         })
        var user = new dto.user({'name':'Rahul'})
        user.save(function(err){
            if(err) {
              console.log('save error', err);
              return err
            }
         })        
        return 'success'
    },    
    queryFromDB: function(){
        console.log('entering queryFromDB')
        var promise = dto.user.find({}).exec()//e
        promise.then(function(users){
             users.forEach(function(user) {
                console.log(user.name)
                user.name = 'Dhruv';
            });            
            
        })
        return promise
    }
}