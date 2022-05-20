const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

/**
 * Gets user based on id
 */
router.get("/withId", (req, res) => {
  let db_connect = dbo.getDb();
  db_connect
    .collection("user")
    .findOne({_id: ObjectId(process.env.USER_ID) }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

/**
 * Edits user
 */
router.post("/editUser", (req, res) => {

  let db_connect = dbo.getDb();

  let myQuery = {
    _id: ObjectId(process.env.USER_ID) 
  }

  let newObj = {$set:
    req.body
  }

  db_connect
    .collection("user")
    .updateOne(myQuery, newObj, function(err, result) {
      if(err) throw err;
      res.json(result)
    })
})

/**
 * Gets user
 */
router.get("/", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
      .collection("user")
      .findOne({}, function(err, result) {
        if (err) throw err;
        res.json({ message: `${JSON.stringify(result)}`})  
      });
});

/**
 * Posts new user
 */
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
      res.json({ message: `${JSON.stringify(result)}`})
    })
})

/**
 * Gets all somelinks
 */
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
    let final = result.map(media => {
      return(media.someName)
    })
    res.json(result)
  })
})

/**
 * Gets specific social media
 */
router.get("/spesificSome/:someName", (req, res) => {
  let db_connect = dbo.getDb();

  let myQuery = { someName: req.params.someName };  

  db_connect
  .collection("user")
  .findOne(myQuery, (err, result) => {
      if(err) throw err
      res.json(result)
  })
})

/**
 * Updates specific social media in the database
 */
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
      res.json(result)
  })
})

/**
 * Inserts some to the database
 */
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
      res.json(result)
  })
})

/**
 * Deletes all specified social medias
 */
router.post("/deleteSeveral", (req, res) => {
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