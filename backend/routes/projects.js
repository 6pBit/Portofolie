const express = require('express')
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

router.get("/projects", (req, res) => {
    console.log(req.baseUrl + " projects route uten param")
    let db_connect = dbo.getDb()
    db_connect
    .collection("projects")
    .findOne({title: "mitt_forst"}, function(err, response) { 
        if(err) throw err
        console.log(result + " get fra projects collection kjørt sites.js")
        res.json(result)
    })
})

router.get("/projects/:title", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("projects")
        .findOne({title: `${req.params.title}`}, function(err, result) {
        if(err) throw err
        console.log("get fra project collection spesifikk project sites.js")
        res.json(result)
    })
})

router.post("/projects/:title", (req, res) => {
    let db_connect = dbo.getDb();

    let myquery = { title: req.params.name };  
    let newvalues = {    
        $set: req.body
    }

    db_connect
    .collection("projects")
    .updateOne(myquery, newvalues, (err, result) => {
        if(err) throw err
        console.log(" oppdaterte ett prosjekt med title: " + `${req.params.title}`)
        res.json(result)
    })
})

module.exports = router;