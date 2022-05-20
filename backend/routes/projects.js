const express = require('express');
const dbo = require("../db/index.js");
const router = express.Router()

const ObjectId = require("mongodb").ObjectId;

router.get("/", (req, res) => {
    let db_connect = dbo.getDb()
    db_connect
    .collection("projects")
    .find({})
    .toArray(function(err, result) {
        if(err) throw err
        res.json(result)
    })
})

/**
 * Gets specific project based on title given in req.params
 */
router.get("/specific/:title", (req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("projects")
        .findOne({title: `${req.params.title}`}, function(err, result) {
        if(err) throw err
        res.json(result)
    })
})

/**
 * Gets all titles from the database
 */
router.get("/titles", (req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection("projects")
        .find({}, {title: 1})
        .toArray(function(err, result) {
                if(err) throw err
                res.json(result)
        })
})

/**
 * Updates specific project based on title given in req.params
 */
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
        res.json(result)
    })
})

/**
 * Inserts a new project to the database
 */
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

/**
 * Deletes a spesific prject from the database
 */
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

/**
 * Gets all imageurls from the database based on req.params
 */
router.get("/imagesToDelete/:titles", (req, res) => {
    let db_connect = dbo.getDb()
    let temp = req.params.titles.split('+')
    let myQuery = {
        title: {$in: temp}
    }
    db_connect
        .collection("projects")
        .find(myQuery, {imageUrl: 1, _id: 0, title: 0, altText: 0, description: 0})
        .toArray(function(err, result) {
                if(err) throw err
                let final = result.map(project => {
                    return(
                        project.imageUrl
                    ) 
                })
                res.json(final)
        })
})

/**
 * Deletes all specified projects from the database
 */
router.post("/deleteSeveral", (req, res) => {
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

module.exports = router;