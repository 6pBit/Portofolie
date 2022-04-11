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
      if (db)
      {
        _db = db.db("portefolje");
        console.log("Successfully connected to MongoDB."); 
      }      
      return callback(err);
         });
  }, 
  getDb: function () {
    return _db;
  },
};
