const express = require('express');
const router = express.Router();
const getWeekly = require('../models/getWeekly.js');
const setWeekly = require('../models/setWeekly.js');

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
    res.json(getWeekly(req.query, res))
    /*res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });*/
});


router.get('/getStats/Monthly', (req, res) => {
    res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });
});

router.post('/setStats/Weekly', (req, res) => {
    res.json(setWeekly(req.body))
    /*res.json({
        response: 'a POST request for CREATING questions',
        body: req.body
    });*/
});

module.exports = router;