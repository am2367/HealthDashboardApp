const express = require('express');
const router = express.Router();
const getWeekly = require('../models/getWeekly.js');
const setWeekly = require('../models/setWeekly.js');
const insertWeekly = require('../models/insertWeekly.js');
const insertDaily = require('../models/insertDaily.js');
const getDaily = require('../models/getDaily.js');
const path = require('path');

router.post('/api/createUser', (req, res) => {
    res.json({ response: 'a GET request for LOOKING at questions' });
});

router.get('/api/getStats/Daily', (req, res) => {
    console.log(req.query)

    getDaily(req.query, function(result){
        console.log(result)

        if(result == 'Empty'){

            insertDaily(req.query, function(result){
                console.log(result)
                res.json('Inserted!')
            })
        }
        else{
            res.json(result)
        }
    })
});

router.get('/api/getStats/Weekly', (req, res) => {
    console.log(req.query)

    getWeekly(req.query, function(result){
        console.log(result)

        if(result == 'Missing Days'){

            insertWeekly(req.query, function(result){
                console.log(result)
                res.json('Inserted!')
            })
        }
        else{
            res.json(result)
        }
    })
});


router.get('/api/getStats/Monthly', (req, res) => {
    res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });
});

router.post('/api/setStats/Weekly', (req, res) => {
    console.log(req.body)

    setWeekly(req.body, function(result){
        console.log(result)

        res.json(result)
    })
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    router.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    router.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }

module.exports = router;