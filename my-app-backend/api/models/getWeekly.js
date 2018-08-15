const getWeekly = (req, res) => {
    var mongoose = require('mongoose');
    //mongoose.connect('mongodb://am2367:AM201475@ds119052.mlab.com:19052/mydb');
    mongoose.connect('mongodb://localhost:27017/myapp');
    var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('MongoDB connected!')
    });
    var response = ''
    var query = {$and: [{Date: { $gt: req.dateStart, $lt: req.dateEnd } }, {Username: 'amarkenzon'}] };
    db.collection("Entries").find(query), function(err, result) {
        if (err) throw err;
        
        if(!result.length){
            response = result;
        }
        else{
            for(x=0; x<7; x++){
                let data = { Date: (new Date(req.dateStart)).getDate() + x,
                    Run: { Time: 0, Distance: 0, Cals: 0 },
                    Swim: { Time: 0, Distance: 0, Cals: 0 },
                    Bike: { Time: 0, Distance: 0, Cals: 0 },
                    Workout: { Time: 0, Distance: 0, Cals: 0 } }

                db.collection("Entries").insert(data), function(err, result) {
                    if (err) throw err;
                    console.log('Inserted Record!')
                    console.log(data)
                
                    db.close();
                };
            }

            result = response
        }
        
        db.close();
    };
    res.json({response: result});
}

module.exports = getWeekly;
