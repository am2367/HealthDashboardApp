const setWeekly = (req, res) => {
    var mongoose = require('mongoose');
    //mongoose.connect('mongodb://am2367:AM201475@ds119052.mlab.com:19052/mydb');
    mongoose.connect('mongodb://localhost:27017/myapp');
    var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('MongoDB connected!')
    });
    
    db.collection("Entries").insert(req), function(err, result) {
        if (err) throw err;
        console.log('Insert Record!')
        console.log(req)
        res.json(result);
        
        
        db.close();
    };
    
}

module.exports = setWeekly;
