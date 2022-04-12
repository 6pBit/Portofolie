const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

// Eksisterer kun en bruker. Så holder å 
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
    tlfnummer: req.body.tlfnummer,
    epost: req.body.epost,
    bilde: {
      bildelenke: req.body.bildelenke,
      alt_tekst: req.body.alt_tekst
    }
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