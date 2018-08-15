var mongoose = require('mongoose');
//"mongodb://am2367:AM201475@ds119052.mlab.com:19052/mydb"
mongoose.connect('mongodb://localhost:27017/myapp');
var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('MongoDB connected!')
});
  var myobj = { username: 'amarkenzon', password: 'password', name: "Alex", age: 22, email: "alex.markenzon@yahoo.com" };
  db.collection("Users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

/*var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  }
});*/

//var User = mongoose.model('User', UserSchema);



//module.exports = User;