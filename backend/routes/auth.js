const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()
const basicAuth = require('express-basic-auth')

const auth = basicAuth({
    users: { admin: '123' } //Behandle passordet bedret
})

router.get('/authenticate', auth, (req, res) => {
    const options = {
        httpOnly: true,
        signed: true
    }
    console.log(req.auth.user)
    
    if(req.auth.user === 'admin') {
        res.cookie('name', 'admin', options).send({screen:'admin'})
    }    
})
router.get('/read-cookie', (req, res) => {
    console.log(req.signedCookies)
    if(req.signedCookies.name === 'admin') {
        res.send({ screen: 'admin'})
    } else {
        res.send({ screen: 'auth'})
    }
})
router.get('/clear-cookie', (req, res) => {
    res.clearCookie('name').end();
  });


module.exports = router;
