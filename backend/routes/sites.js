const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

router.get("/:name", (req, res) => {
    let db_connect = dbo.getDb("portefolje");
    db_connect
      .collection("sites")
      .findOne({name: `${req.params.name}` }, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        db.close();
  
      });
    //res.json({ message: "Hello from server!" });
});

module.exports = router;