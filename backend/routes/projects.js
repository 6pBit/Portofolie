const { response } = require('express');
const express = require('express');
const { route } = require('express/lib/application');
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

//Denne fungerer
/*
router.get("/", (req, res) => {
    console.log(req.baseUrl + " projects route uten param")
    let db_connect = dbo.getDb()
    db_connect
    .collection("projects")
    .findOne({title: "mitt_forst"}, function(err, result) { 
        if(err) throw err
        console.log(result + " get fra projects collection kjørt projects.js")
        res.json(result)
    })
})
*/
router.get("/", (req, res) => {
    console.log(req.baseUrl + " projects route uten param")
    let db_connect = dbo.getDb()
    db_connect
    .collection("projects")
    .find({})
    .toArray(function(err, result) {
        //console.log(JSON.stringify(result) + " sender resultat array fra project get projects.js")
        if(err) throw err
        res.json(result)
    })
})

router.get("/:title", (req, res) => {
    console.log("her er parameter title: " + req.params.title)
    let db_connect = dbo.getDb();
    db_connect
        .collection("projects")
        .findOne({title: `${req.params.title}`}, function(err, result) {
        if(err) throw err
        console.log("get fra project collection spesifikk project sites.js")
        console.log(result + " her er det som sendes fra project")
        res.json(result)
    })
})

router.post("/update/:title", (req, res) => {
    let db_connect = dbo.getDb();

    let myquery = { title: req.params.title };  
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

router.post("/insert", (req, res) => {
    let db_connect = dbo.getDb();
  
    let newValues = req.body

    db_connect
    .collection("projects")
    .insertOne(newValues, (err, result) => {
        if(err) throw err
        res.json("La til et prosjekt i databasen")
    })
})

router.post("/delete/:title", (req, res) => {
    let db_connect = dbo.getDb()
    let myQuery = {title: req.params.title}
    db_connect
    .collection("projects")
    .deleteOne(myQuery, (err, result) => {
        if(err) throw err
        res.json("Ett prosjekt med tittelen: " + result.title + " ble fjernet fra databasen")
    })
})



module.exports = router;