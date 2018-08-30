const insertWeekly = (req, callback) => {
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

        var insertList = []

        for(x=0; x<7; x++){
            let date = new Date(req.dateStart)
            date.setDate(date.getDate() + x);
            /*let data = { Date: date,
                Run: { Time: 0, Distance: 0, Cals: 0 },
                Swim: { Time: 0, Distance: 0, Cals: 0 },
                Bike: { Time: 0, Distance: 0, Cals: 0 },
                Workout: { Time: 0, Distance: 0, Cals: 0 } }*/
            
            //insertList.push(data)

            dbo.collection("Entries").update({Date: date},{ Date: date,
                Run: { Time: 0, Distance: 0, Cals: 0 },
                Swim: { Time: 0, Distance: 0, Cals: 0 },
                Bike: { Time: 0, Distance: 0, Cals: 0 },
                Workout: { Time: 0, Distance: 0, Cals: 0 }},{upsert: true}, function(err, result) {
                if (err) throw err;
    
                //callback(result)
            
            });

            
        }
        callback('Inserted!')

        db.close();
    })
}

module.exports = insertWeekly;
