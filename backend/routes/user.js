const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

// Eksisterer kun en bruker. Så holder å 

router.get("/withId/:id", (req, res) => {
  let db_connect = dbo.getDb();
  db_connect
    .collection("user")
    .findOne({_id: ObjectId(req.params.id) }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

router.post("/editUser/:id", (req, res) => {

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
      res.json(result)
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

router.get("/someLinks", (req, res) => {
  let db_connect = dbo.getDb()

  let myQuery = {
    someName: {$in:["facebook", "snapchat", "instagram", "twitter", "linkedin", "tiktok", "wechat", "github"]}
  }

  db_connect
  .collection("user")
  .find(myQuery)
  .toArray(function(err, result) {
    if(err) throw err
    console.log("Hei jeg ble kjørt")
    let final = result.map(media => {
      return(media.someName)
    })
    final.forEach(media => console.log(media + " media"))
    res.json(result)
  })
})

router.get("/spesificSome/:someName", (req, res) => {
  let db_connect = dbo.getDb();

  let myQuery = { someName: req.params.someName };  

  db_connect
  .collection("user")
  .findOne(myQuery, (err, result) => {
      if(err) throw err
      //console.log(" oppdaterte ett prosjekt med title: " + `${req.params.title}`)
      res.json(result)
  })
})

router.post("/update/:someName", (req, res) => {
  let db_connect = dbo.getDb();

  let myquery = { someName: req.params.someName };  
  let newValues = {    
      $set: req.body
  }

  db_connect
  .collection("user")
  .updateOne(myquery, newValues, (err, result) => {
      if(err) throw err
      //console.log(" oppdaterte ett prosjekt med title: " + `${req.params.title}`)
      res.json(result)
  })
})

router.post("/insertSome", (req, res) => {
  let db_connect = dbo.getDb();

  let newObject = {
    someName: req.body.someName,
    connectionUrl: req.body.connectionUrl
  }

  db_connect
  .collection("user")
  .insertOne(newObject, (err, result) => {
      if(err) throw err
      //console.log(" oppdaterte ett prosjekt med title: " + `${req.params.title}`)
      res.json(result)
  })
})

router.post("/deleteSeveral", (req, res) => {
  console.log("Her er req.body i deleteSeveral" + JSON.stringify(req.body.someNames))
  let db_connect = dbo.getDb()
  let myQuery = {
      someName: {$in: req.body.someNames}
  }
  db_connect
  .collection("user")
  .deleteMany(myQuery, (err, result) => {
      if(err) throw err
      res.json(result)
  })
})

module.exports = router;

//$in["facebook", "snapchat", "instagram", "twitter", "linkedin", "tiktok", "wechat"]