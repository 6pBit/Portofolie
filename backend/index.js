// server/index.js
const path = require('path');
const express = require("express");
const cors = require('cors')
const cookieParser = require('cookie-parser')
//livereload
/*
const livereload = require('livereload')
const liveRealoadServer = livereload.createServer()
const connectLiveReload = require('connect-livereload')
liveRealoadServer.watch(path.resolve(__dirname, '../client/build'))
liveRealoadServer.server.once("connection", () => {
  setTimeout(() => {
    liveRealoadServer.refresh("../client/build/index.html")
  }, 100)
  
})
*/
const apiExample = require('./routes/apiExample.js')
const sites = require('./routes/sites.js')
const user = require('./routes/user.js')
const edit = require('./routes/edit.js')
const projects = require('./routes/projects.js')
const email = require('./routes/email.js')
const fileUpload = require('./routes/fileUpload.js')
const auth = require('./routes/auth')

const db = require('./db');
const dbo = require("./db/index.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'))

// Have Node serve the files for our built React app
//app.use(connectLiveReload())//livereload
app.use(express.static(path.resolve(__dirname, '../client/build')));// 
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html')); // 
});
app.get("/public/images/:resource", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/images', req.params.resource))
})
app.get("/public/files/:resource", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/files', req.params.resource))
})
// Handle GET requests to /api route

app.use("/sites", sites)
app.use("/user", user)
app.use("/projects", projects)
app.use("/api", apiExample);
app.use("/edit", edit)
app.use("/email", email)
app.use("/fileUpload", fileUpload)
app.use("/auth",auth )

console.log(app.path()+"hei")
// All other GET requests not handled before will return our React app

//Lagt til i forbindelse med AWS og S3 bucket. Får se om den er nødvendig
app.engine('html', require('ejs').renderFile)

app.listen(PORT, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err); 
  });
  console.log(`Server listening on ${PORT}`);
});

