const moment =  require('moment');

const insertYearly = (year, username, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    //Connection details for mLab if environmental variables exist (deployed from cloud)
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/mydb";
    }
    //Local mongodb url
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

        dbo.collection("Entries").insertOne( { [year]: [], Username: username } );

        for(month=0; month<12; month++){
            let daysInMonth = moment().startOf('year').add(month, 'M').daysInMonth();

            for(day=1; day<(daysInMonth+1); day++){

                let monthVal = month + 1
                let date = year + "-" + monthVal + "-" + day

                let presetData = {  Time: 0, 
                                    TimeExpected: 0,
                                    Distance: 0,
                                    DistanceExpected: 0,
                                    Intensity: 0,
                                    IntensityExpected: 0, 
                                    Cals: 0,
                                    CalsExpected: 0 }

                dbo.collection("Entries").update({$and: [{[year]: {$exists : true}},
                                                         {Username: username}]},
                                                         {$set:
                                                            {[year + '.' + monthVal + '.' + day]: 
                                                                {   Date: date,
                                                                    Run: presetData,
                                                                    Swim: presetData,
                                                                    Bike: presetData,
                                                                    Workout: presetData}}},
                                                                {upsert: true})            
            }
        }
        callback('Inserted!')
        db.close();
    })
}

module.exports = insertYearly;
