const getWeekly = (req, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    var Cloudant = require('@cloudant/cloudant');
    let username = '';
    let password = '';
    let url = '';

    var cloudUsername = process.env.cloudant_username;
    var cloudPassword = process.env.cloudant_password;
    var cloudant = Cloudant({account:cloudUsername, password:cloudPassword});
    var mydb = cloudant.db.use('mydb')
    if (process.env.mLabUser){
        username = process.env.mLabUser;
        password = process.env.mLabPassword;
        url = "mongodb://" + username + ':' + password + "@ds119052.mlab.com:19052/mydb";
    }
    else{
        url = "mongodb://localhost:27017/myapp";
    }
    //MongoClient.connect(url, function(err, db) {
        var query = {Date: { $gte: new Date(req.dateStart), $lte: new Date(req.dateEnd) } }
        mydb.find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            
            if(result.length == 7){
                console.log(result)
                callback(result);
            }
            else{
                callback('Missing Days')
            }    
        
            db.close();
        });
        /*var query = {$and: 
                        [{Date: 
                            { $gte: new Date(req.dateStart), 
                              $lte: new Date(req.dateEnd) } 
                            }, 
                            {Username: 'amarkenzon'}
                        ]};*/

        /*if (err) throw err;
        console.log("Database Connected!");
        
        var dbo = db.db("myapp");

        dbo.collection("Entries").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            
            if(result.length == 7){
                console.log(result)
                callback(result);
            }
            else{
                callback('Missing Days')
            }    
        
            db.close();
        });
    });*/
}

module.exports = getWeekly;
