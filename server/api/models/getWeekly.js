const getWeekly = (req, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    if (!process.env.mLabUser){
        var url = "mongodb://localhost:27017/myapp";
    }
    else{
        let username = process.env.mLabUser;
        let password = process.env.mLabPassword;
        var url = "mongodb://" + username + ':' + password + "@ds119052.mlab.com:19052/mydb";
    }
    MongoClient.connect(url, function(err, db) {
        var query = {Date: { $gte: new Date(req.dateStart), $lte: new Date(req.dateEnd) } }
        /*var query = {$and: 
                        [{Date: 
                            { $gte: new Date(req.dateStart), 
                              $lte: new Date(req.dateEnd) } 
                            }, 
                            {Username: 'amarkenzon'}
                        ]};*/

        if (err) throw err;
        console.log("Database Connected!");
        
        var dbo = db.db("myapp");

        dbo.collection("Entries").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            
            if(result.length > 0){
                console.log(result)
                callback(result);
            }
            else{
                callback('Empty')
            }
            
            db.close();
        });
    });
}

module.exports = getWeekly;
