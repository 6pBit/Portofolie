// server/index.js
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db');
const dbo = require("./db/index.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
/*
//db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('open', function () {
  db.db.listCollections().toArray(function (err, collectionNames) {
    if (err) {
      console.log(err);
      return;
    }
      console.log(collectionNames);
      db.close();
  });
});
*/


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
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

// All other GET requests not handled before will return our React app

app.get("/", (req, res) => {

  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server listening on ${PORT}`);
});

