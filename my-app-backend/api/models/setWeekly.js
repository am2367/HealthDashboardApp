const setWeekly = (req, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/myapp";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");

        var dbo = db.db("myapp");

        var myquery = {Date: new Date(req.Date)};
        console.log(req.Date)
        console.log(myquery)
        var newvalues = { $set: {Run: req.Run, Swim: req.Swim, Bike: req.Bike, Workout: req.Workout}};
        dbo.collection("Entries").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;

            callback(result)
        });

        db.close();
    });
    
    
    
}

module.exports = setWeekly;
