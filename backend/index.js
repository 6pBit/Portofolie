// server/index.js
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const apiExample = require('./routes/apiExample.js')
const sites = require('./routes/sites.js')
const user = require('./routes/user.js')

const db = require('./db');
const dbo = require("./db/index.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.use("/api", apiExample);
app.use("/sites", sites)
app.use("/user", user)
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

