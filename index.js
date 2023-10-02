const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://woobin:rkd10230929!@cluster0.zri6zof.mongodb.net/').then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! kkk')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})