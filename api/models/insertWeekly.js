const insertWeekly = (req, username, callback) => {
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
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

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
                Workout: { Time: 0, Distance: 0, Cals: 0 },
                Username: username},{upsert: true}, function(err, result) {
                if (err) throw err;
    
                //callback(result)
            
            });

            
        }
        callback('Inserted!')

        db.close();
    })
}

module.exports = insertWeekly;
