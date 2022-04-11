const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

router.get("/", (req, res) => {
    let db_connect = dbo.getDb("sample_mflix");
    db_connect
      .collection("movies")
      .find({title: "Blacksmith Scene"})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json({message: `${result[0].title}`});
  
      });
    //res.json({ message: "Hello from server!" });
});

module.exports = router;