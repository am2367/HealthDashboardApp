const express = require('express');
const router = express.Router();
const getWeekly = require('../models/getWeekly.js');
const setWeekly = require('../models/setWeekly.js');
const insertWeekly = require('../models/insertWeekly.js');
const path = require('path');

router.use(express.static(path.join(__dirname, '../../../build')));



router.post('/createUser', (req, res) => {
    res.json({ response: 'a GET request for LOOKING at questions' });
});

router.get('/getStats/Daily', (req, res) => {
    res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });
});

router.get('/getStats/Weekly', (req, res) => {
    console.log(req.query)

    getWeekly(req.query, function(result){
        console.log(result)

        if(result == 'Empty'){

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


router.get('/getStats/Monthly', (req, res) => {
    res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });
});

router.post('/setStats/Weekly', (req, res) => {
    console.log(req.body)

    setWeekly(req.body, function(result){
        console.log(result)

        res.json(result)
    })
});

router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../../', 'build', 'index.html'));
});

module.exports = router;