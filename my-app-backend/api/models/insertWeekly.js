const insertWeekly = (req, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/myapp";

    MongoClient.connect(url, function(err, db) {
        console.log("Database Connected!");
        
        var dbo = db.db("myapp");

        var insertList = []

        for(x=0; x<7; x++){
            let date = new Date(req.dateStart)
            date.setDate(date.getDate() + x);

            let data = { Date: date,
                Run: { Time: 0, Distance: 0, Cals: 0 },
                Swim: { Time: 0, Distance: 0, Cals: 0 },
                Bike: { Time: 0, Distance: 0, Cals: 0 },
                Workout: { Time: 0, Distance: 0, Cals: 0 } }
            
            insertList.push(data)
        }
        dbo.collection("Entries").insertMany(insertList, function(err, result) {
            if (err) throw err;

            callback(result)
        
        });

        db.close();
    })
}

module.exports = insertWeekly;
