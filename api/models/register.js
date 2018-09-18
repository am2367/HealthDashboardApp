const bcrypt = require('bcrypt');

const register = (req, callback) => {
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

        bcrypt.hash(req.password, 10, function(err, hash) {
            let user = {username: req.username, 
                password: hash, 
                lastName: req.lastName, 
                firstName: req.firstName, 
                email: req.email}

            dbo.collection("Users").insertOne(user, function(err, res) {
                if (err) throw err;
                console.log("Inserted");
            });
            db.close();

            callback('Registered')
        });        
    })
}

module.exports = register;
