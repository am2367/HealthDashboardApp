const excel = require('node-excel-export');

const exportData = (req, username) => {
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
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        let query = {Username: username}

        dbo.collection("Entries").find(query, {Array: {Object: {Object: 1} } }).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                db.close();
                console.log(result)
                generateExport(result);
            }
            else{
                db.close();
                return "Empty";
            }
        });
    });

    function generateExport(data){
        //Array of objects representing heading rows (very top)
        const heading = [
            [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
            ['a2', 'b2', 'c2'] // <-- It can be only values
        ];
    }
}

module.exports = exportData;
