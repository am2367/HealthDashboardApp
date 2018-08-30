const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var cors = require('cors');
const app = express();
const port = process.env.PORT || 4200;
app.use(express.static(`${__dirname}/client/build`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//add routes to express app
var routes = require('./api/routes/routes.js'); //importing route

app.use(cors());
app.use('/', routes);

//start Express server on defined port
app.listen(port);

console.log('API server started on: ' + port);