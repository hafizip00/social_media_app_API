const route = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

route.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.send("error");
  }
});

route.post("/login" , async (req , res)=>{
    try {
        const user = await User.findOne({email : req.body.email})
    !user && res.status(404).send("Account Not Found Please Register First!")
    const validPassword  = await bcrypt.compare(req.body.password , user.password)
    !validPassword && res.status(400).json("Wrong Password!")
    res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }
})

module.exports = route;
