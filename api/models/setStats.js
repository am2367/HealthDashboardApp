const setStats = (req, username, callback) => {
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
        if (err) throw err;
        console.log("Database created!");

        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        var myquery = {Date: new Date(req.Date), Username: username};
        console.log(req.Date)
        console.log(myquery)
        var newvalues = { $set: {Run: req.Run, Swim: req.Swim, Bike: req.Bike, Workout: req.Workout}};
        dbo.collection("Entries").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            callback('Saved!')
        });

        db.close();
    });
    
    
    
}

module.exports = setStats;
