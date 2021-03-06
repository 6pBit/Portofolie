const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

/**
 * A Route for getting the sites information from DB
 */
router.get("/:name", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
      .collection("sites")
      .findOne({name: `${req.params.name}` }, function(err, result) {
        if (err) throw err;
        res.json(result);
      });
});
router.get("/", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
      .collection("sites")
      .find({})
      .toArray( function(err, result) {
        if (err) throw err;
        res.json(result);
      });
});
router.post("/:name", (req, res) => {
    let db_connect = dbo.getDb();
    let myquery = { name: req.params.name };  
    let newvalues = {    
        $set: req.body
    }
    db_connect
    .collection("sites")
    .updateOne(myquery, newvalues, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})
router.post("/", (req, res) => {
    let db_connect = dbo.getDb();
    let myObj = req.body    
    db_connect.collection("sites")
        .insertOne(myObj, (err, result) => {
            if (err) throw err;
            res.json(result);
        })
})
//Express middleware functionality which take the name attribute and makes it all lower case letters, before its used in fetching against the db
router.param('name', (req, res, next, name) => {
    const modified = name.toLowerCase()
    req.name = modified
    next()
})

module.exports = router;