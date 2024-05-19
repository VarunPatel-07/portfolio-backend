require('dotenv').config()  
const mongoose = require('mongoose')
const mongoURL = process.env.MONGO_URI

const ConnectToMongoDB = async ()=>{
    await mongoose.connect(mongoURL)
    console.log('Connected to Database Successfully')
}
module.exports = ConnectToMongoDB