const mongoose = require('mongoose')

const db = mongoose.connect("mongodb://127.0.0.1:27017/mynodeapp")
.then(async () => { console.log("conncted to mongodb database") })
.catch((err) => console.log(err))