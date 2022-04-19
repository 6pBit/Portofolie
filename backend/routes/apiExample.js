const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

router.get("/", (req, res) => {
  
    let db_connect = dbo.getDb();
    db_connect
      .collection("user")
      .find({fornavn: "test_bruker_fornavn"})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json({message: `${result[0].etternavn}`});
  
      });
    //res.json({ message: "Hello from server!" });
});

module.exports = router;