var dto = require('./dto')

module.exports = {
    postToDB :  function(userName){
        var user = new dto.user({'name':userName})               
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
        var promise = dto.user.find({}).exec()
        return promise
    }
}