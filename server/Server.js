const path = require(`path`)
const express = require('express');
const app = express();
const port = process.env.PORT || 5000

const publicPath = path.join(__dirname, '..', 'public')

app.use(express.static(publicPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
})
app.get('/express_backend', (req, res) => { 
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})