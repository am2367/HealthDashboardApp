const moment =  require('moment');

const setStats = (req, username, callback) => {
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
        if (err) throw err;
        console.log("Database Connected!");

        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        let year = moment(req.Date).format('YYYY');
        let month = moment(req.Date).format('M') * 1;
        let day = moment(req.Date).format('D') * 1;

        var myquery = {["Year." + year + '.Month.' + month + '.Day.' + day]: Object, Username: username};

        //console.log(myquery)
        var newvalues = { $set: {["Year." + year + '.Month.' + month + '.Day.' + day]: {Date: req.Date, Run: req.Run, Swim: req.Swim, Bike: req.Bike, Workout: req.Workout}}};
        dbo.collection("Entries").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            callback('Saved!')
            db.close();
            return;
        });

        db.close();
    });
    
    
    
}

module.exports = setStats;
