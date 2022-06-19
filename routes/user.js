const route = require('express').Router()

route.get("/" ,(req , res) =>{
    res.send("FROM USERS")
})


module.exports = route;