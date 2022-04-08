const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log('Now the value for FOO is:', process.env.MONGO_UNAME);
const uri = `mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PWORD}@uni.lw4zc.mongodb.net/sample_mflix?retryWrites=true&w=majority`

mongoose
    .connect(uri, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db