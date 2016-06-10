var mongodb =require('mongodb');
var server = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var db = new mongodb.Db('nodedb', server, {safe:true});
db.open(function(err, db){
    if(!err){
        console.log('connect');
        db.collection('person',{safe:true}, function(err, col){
                 if(err){
                      console.log(err);
                 }
            col.find().toArray(function(err,docs){
                console.log('find');
                console.log(docs);
            });

        })

        }else{
        console.log(err);
    }
});