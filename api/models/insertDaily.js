const insertDaily = (req, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    if (process.env.mLabUser){
        let username = process.env.mLabUser;
        let password = process.env.mLabPassword;
        var url = "mongodb://" + username + ':' + password + "@ds119052.mlab.com:19052/mydb";
    }
    else{
        var url = "mongodb://localhost:27017/myapp";
    }

    MongoClient.connect(url, function(err, db) {
        console.log("Database Connected!");
        
        var dbo = db.db("myapp");

        let date = new Date(req.date)

        let data = { Date: date,
            Run: { Time: 0, Distance: 0, Cals: 0 },
            Swim: { Time: 0, Distance: 0, Cals: 0 },
            Bike: { Time: 0, Distance: 0, Cals: 0 },
            Workout: { Time: 0, Distance: 0, Cals: 0 } }

        dbo.collection("Entries").insert(data, function(err, result) {
            if (err) throw err;

            callback(result)
        
        });

        db.close();
    })
}

module.exports = insertDaily;
