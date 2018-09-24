const express = require('express');
const router = express.Router();
const setStats = require('../models/setStats.js');
const getYearly = require('../models/getYearly.js');
const getWeekly = require('../models/getWeekly.js');
const getMonthly = require('../models/getMonthly.js');
const insertYearly = require('../models/insertYearly.js');
const insertMonthly = require('../models/insertMonthly.js');
const insertWeekly = require('../models/insertWeekly.js');
const insertDaily = require('../models/insertDaily.js');
const getDaily = require('../models/getDaily.js');
const validateCreds = require('../models/validateCreds.js');
const register = require('../models/register.js');
const path = require('path');
const moment =  require('moment');
const exportData = require('../models/exportData.js');

//login
router.post('/api/login', (req, res) => {
    //console.log(req.body)
    validateCreds(req.body, function(result){
        console.log(result)
        if(result == 'Correct'){
            req.session.username = req.body.username;
            req.session.save;
            res.json('Correct')
        }
        else{
            res.json('Incorrect')
        }
    })
});

//logout
router.get('/api/logout', (req, res) => {
    //console.log(req.query)
    req.session.username = null
    res.json('Logged Out')
});

//check session
router.get('/api/checkSession', (req, res) => {
    //console.log('Check Session')
    if(req.session.username){
        res.json('Active')
    }
    else{
        res.json('Inactive')
    }
});

//get username
router.get('/api/getUsername', (req, res) => {
    //console.log(req.query)
    if(req.session.username){
        res.json(req.session.username)
    }
    else{
        res.json(false)
    }
});

//register
router.post('/api/register', (req, res) => {
    console.log(req.body)
    register(req.body, function(result){
        //console.log(result)
        if(result === 'Registered'){
            req.session.username = req.body.username;
            req.session.save;
            insertYearly(moment().format('YYYY'), req.session.username, function(result){
                //console.log(result);
                res.json('Registered')
            })
        }
        else if(result === "Username Taken"){
            res.json("Username Taken");
        }
        else if(result === "Email Taken"){
            res.json("Email Taken");
        }
        else{
            res.json('Error')
        }
    })
});

//get yearly stats
router.get('/api/getStats/Yearly', (req, res) => {
    console.log(req.query)

    if(req.session.username){

        getYearly(req.query.year, req.session.username, function(result){
            //console.log(result)
            
            if(result == 'Empty'){

                insertYearly(req.query.year, req.session.username, function(result){
                    //console.log(result)
                    res.json('Inserted!')
                })
            }
            else{
                res.json(result)
            }
        })
    }
    else{
        res.redirect('/login');
    }
});


//get daily stats
router.get('/api/getStats/Daily', (req, res) => {
    console.log(req.query)

    if(req.session.username){

        getDaily(req.query, function(result){
            //console.log(result)

            if(result == 'Empty'){

                insertDaily(req.query, function(result){
                    //console.log(result)
                    res.json('Inserted!')
                })
            }
            else{
                res.json(result)
            }
        })
    }
    else{
        res.redirect('/login');
    }
});

//get weekly stats
router.get('/api/getStats/Weekly', (req, res) => {
    console.log(req.query)

    if(req.session.username){

        getWeekly(req.query, req.session.username, function(result){
            //console.log(result)

            if(result == 'Missing Days'){

                insertWeekly(req.query, req.session.username, function(result){
                    //console.log(result)
                    res.json('Inserted!')
                })
            }
            else{
                res.json(result)
            }
        })
    }
    else{
        res.redirect('/login');
    }
});

//set weekly stats
router.post('/api/setStats', (req, res) => {
    console.log(req.body)

    if(req.session.username){

        setStats(req.body, req.session.username, function(result){
            //console.log(result)

            res.json(result)
        })
    }
    else{
        res.redirect('/login');
    }
});

//get monthly stats
router.get('/api/getStats/Monthly', (req, res) => {
    console.log(req.query)

    if(req.session.username){

        getMonthly(req.query, req.session.username, function(result){
            //console.log(result)

            if(result == 'Missing Days'){

                insertMonthly(req.query, req.session.username, function(result){
                    //console.log(result)
                    res.json('Inserted!')
                })
            }
            else{
                res.json(result)
            }
        })
    }
    else{
        res.redirect('/login');
    }
});

router.get('/api/export', (req, res) => {
    console.log(req.query)

    if(req.session.username){
        data = exportData(req.query, req.session.username)
        res.json(data)
    }
});

//if production > serve static files
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    router.use(express.static(path.join(__dirname, '../../client/build')));
    // Handle React routing, return all requests to React app
    router.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
};

module.exports = router;