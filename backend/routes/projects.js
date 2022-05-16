const { response } = require('express');
const express = require('express');
const { route } = require('express/lib/application');
const db = require('../db/index.js');
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
    //console.log(req.baseUrl + " projects route uten param")
    let db_connect = dbo.getDb()
    db_connect
    .collection("projects")
    .find({}) // bestemmer hva du ønsker å hente fra databasen
    .toArray(function(err, result) {
        //console.log(JSON.stringify(result) + " sender resultat array fra project get projects.js")
        if(err) throw err
        res.json(result)
    })
})

router.get("/specific/:title", (req, res) => {
    console.log("her er parameter title: " + req.params.title)
    let db_connect = dbo.getDb();
    db_connect
        .collection("projects")
        .findOne({title: `${req.params.title}`}, function(err, result) {
        if(err) throw err
        //console.log("get fra project collection spesifikk project sites.js")
        //console.log(result + " her er det som sendes fra project")
        res.json(result)
    })
})

router.get("/titles", (req, res) => {
    console.log("henter kun titles")
    let db_connect = dbo.getDb()
    db_connect
        .collection("projects")
        .find({}, {title: 1})
        .toArray(function(err, result) {
                if(err) throw err
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
        //console.log(" oppdaterte ett prosjekt med title: " + `${req.params.title}`)
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

router.get("/imagesToDelete/:titles", (req, res) => {
    let db_connect = dbo.getDb()
    let temp = req.params.titles.split('+')
    /*
    for(let i=0; i<req.params.length; i++) {
        console.log(req.params.titles[i] + " dette legges inn i temp fra params")
        temp.push(req.params.titles[i])
    }*/
    console.log(JSON.stringify(temp) + " temp i imagesToDelete")
    let myQuery = {
        title: {$in: temp}
    }
    db_connect
        .collection("projects")
        .find(myQuery, {imageUrl: 1, _id: 0, title: 0, altText: 0, description: 0}) //vil ikke kun gi imageUrl, så bruker hele documentet
        .toArray(function(err, result) {
                if(err) throw err
                console.log(JSON.stringify(result) + " dette er filepaths som skal slettes")
                // får feilmeldinger om man får inn tom verdi eller en faktisk lenke her.
                let final = result.map(project => {
                    return(
                        project.imageUrl
                    ) 
                })
                
                console.log(JSON.stringify(final) + " dette er filepaths som skal slettes etter final")
                res.json(final)
        })
})

router.post("/deleteSeveral", (req, res) => {
    console.log("Her er req.body i deleteSeveral" + JSON.stringify(req.body.titles))
    let db_connect = dbo.getDb()
    let myQuery = {
        title: {$in: req.body.titles}
    }
    db_connect
    .collection("projects")
    .deleteMany(myQuery, (err, result) => {
        if(err) throw err
        res.json(result)
    })
})
/*
).deleteMany(myQuery, (err, result) => {
    if(err) throw err
    res.json("Det gikk gitt")
})
*/
module.exports = router;