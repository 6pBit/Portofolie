const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

router.get("/:name", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
      .collection("sites")
      .findOne({name: `${req.params.name}` }, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        res.json(result);
      });
});
router.get("/", (req, res) => {
    console.log(req.baseUrl)
    let db_connect = dbo.getDb();
    db_connect
      .collection("sites")
      .find({})
      .toArray( function(err, result) {
        if (err) throw err;
        res.json(result);
      });
});


router.post("/", (req, res) => {
    console.log("sett inn metode kjørt")
    let db_connect = dbo.getDb();
    let myObj = req.body    
    db_connect.collection("sites")
        .insertOne(myObj, (err, result) => {
            if (err) throw err;
            res.json(result);
            console.log(result)
        })
})

router.param('name', (req, res, next, name) => {
    const modified = name.toLowerCase()
    req.name = modified
    console.log(JSON.stringify(name))
    next()
})

router.post("/:name", (req, res) => {
    console.log("updaten kjørt")
    let db_connect = dbo.getDb();
    let myquery = { name: req.params.name };  
    let newvalues = {    
        $set: req.body
    }
    db_connect.collection("sites").updateOne(myquery, newvalues, (err, result) => {
        if (err) throw err;
        //console.log("1 document updated"+"\n"+JSON.stringify(result));
        res.json(result);
    })
})

module.exports = router;