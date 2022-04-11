const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

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
    let db_connect = dbo.getDb();
    let myObj = {
        name: req.body.name,
        title: req.body.title
    };
    db_connect.collection("sites")
        .insertOne(myObj, (err, result) => {
            if (err) throw err;
            res.json(result);
        })
})
router.post("/:name", (req, res) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};  
    let newvalues = {    
        $set: req.body.newvalues
    }
    dbo.collection("sites").updateOne(myquery, newvalues, (err, res) => {
        if (err) throw err;
        console.log("1 document updated");
    })
})

module.exports = router;