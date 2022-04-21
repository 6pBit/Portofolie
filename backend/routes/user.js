const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

// Eksisterer kun en bruker. Så holder å 

router.get("/:id", (req, res) => {
  let db_connect = dbo.getDb();
  db_connect
    .collection("user")
    .findOne({_id: ObjectId(req.params.id) }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

router.post("/:id", (req, res) => {

  console.log(req.params.id + " id fra params route user")

  let db_connect = dbo.getDb();

  let myQuery = {
    _id: ObjectId(req.params.id)
  }

  let newObj = {$set:
    req.body
  }

  db_connect
    .collection("user")
    .updateOne(myQuery, newObj, function(err, result) {
      if(err) throw err;
      console.log(JSON.stringify(result))
    })
})

router.get("/", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
      .collection("user")
      .findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.json({ message: `${JSON.stringify(result)}`})  
      });
});

router.post("/", (req, res) => {
  let db_connect = dbo.getDb();
  let newObj = {
    fornavn: req.body.fornavn,
    etternavn: req.body.etternavn,
    tlfnummer: req.body.tlfNummer,
    epost: req.body.epost,
    bildelenke: req.body.bildelenke,
    alt_tekst: req.body.bilde_alt_tekst
    
  };
  db_connect
    .collection("user")
    .insertOne(newObj, function(err, result) {
      if(err) throw err;
      console.log(JSON.stringify(result))
      res.json({ message: `${JSON.stringify(result)}`})
    })
})

module.exports = router;