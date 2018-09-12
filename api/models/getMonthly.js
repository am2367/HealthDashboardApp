const getMonthly = (req, username,callback) => {
    var MongoClient = require('mongodb').MongoClient;
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/mydb";
    }
    else{
        var url = "mongodb://localhost:27017/myapp";
    }
    MongoClient.connect(url, function(err, db) {
        //var query = {Date: { $gte: new Date(req.dateStart), $lte: new Date(req.dateEnd) } }
        var query = {$and: 
                        [{Date: 
                            { $gte: new Date(req.dateStart), 
                              $lte: new Date(req.dateEnd) } 
                            }, 
                            {Username: username}
                        ]};

        if (err) throw err;
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        dbo.collection("Entries").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            
            if(result.length >= 28){
                //console.log(result)
                callback(result);
            }
            else{
                callback('Missing Days')
            }    
        
            db.close();
        });
    });
}

module.exports = getMonthly;
