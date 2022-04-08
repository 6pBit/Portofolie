const { MongoClient } = require("mongodb");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Db = process.env.MONGO_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("sample_mflix");
        console.log("Successfully connected to MongoDB."); 
      }
      
      return callback(err);
         });
  },
 
  getDb: function () {
    return _db;
  },
};
/*
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log('Now the value for FOO is:', process.env.MONGO_UNAME);
const uri = `${process.env.MONGO_URI}`

mongoose
    .connect(uri, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
*/