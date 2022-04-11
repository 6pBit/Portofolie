const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

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

module.exports = router;