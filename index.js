const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')


const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')


const app = express()
app.use(express.json())
const DB = "mongodb://localhost:27017/mydb"

mongoose.connect(DB).then(()=>{
    console.log("Connect");
})


app.use(morgan("common"))
app.use(helmet())

app.use('/api/users' , userRoute)
app.use('/api/auth' , authRoute)



app.listen(8800 , ()=>{
    console.log("listening....");
})