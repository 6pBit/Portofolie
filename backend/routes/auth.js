const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()
const basicAuth = require('express-basic-auth')

/**
 * Setsup the user authentication with express-basic-auth
 * Refrence: https://blog.logrocket.com/how-to-secure-react-app-login-authentication/
 */

const auth = basicAuth({
    users: { [process.env.USER]: process.env.USER_PASS } 
})
router.get('/authenticate', auth, (req, res) => {
    const options = {
        httpOnly: true,
        signed: true
    }    
    if(req.auth.user === process.env.USER) {
        res.cookie('name', process.env.USER, options).send({screen:process.env.USER})
    }    
})
router.get('/read-cookie', (req, res) => {
    if(req.signedCookies.name === process.env.USER) {
        res.send({ screen: process.env.USER})
    } else {
        res.send({ screen: 'auth'})
    }
})
router.get('/clear-cookie', (req, res) => {
    res.clearCookie('name').end();
  });
  
module.exports = router;
