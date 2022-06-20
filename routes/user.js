const route = require("express").Router();
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");
const User = require("../models/User");

// update User
// delete User
// follow user
// unfollow user
route.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await  User.findByIdAndUpdate(req.params.id, ($set = req.body));
      res.status(200).json("Account Has been updated")
    } catch (error) {
        res.status(500).json(error)
    }
  } else {
    res.status(403).send("you can only update your account only");
  }
});
//Delete user

route.delete("/:id", async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {
      try {
        await User.deleteOne({_id : req.params.id});
        res.status(200).json("Account Has been Deleted")
      } catch (error) {
          return res.status(500).json("error")
      }
    } else {
      res.status(403).send("you can only delete your account only");
    }
  });

route.get("/", (req, res) => {
  res.send("FROM USERS");
});

module.exports = route;
