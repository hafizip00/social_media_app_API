const route = require('express').Router()
const User = require('../models/User')

route.get("/register" , async (req , res) =>{
    const user = new User({
        username : "John" ,
        email : "johndoe@gmail.com",
        password : "123456"
    })

    await user.save()
    res.send("USER ADDEDDDD")
})


module.exports = route;