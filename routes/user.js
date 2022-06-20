const route = require("express").Router();
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");
const User = require("../models/User");


// follow user
// unfollow 

// update User
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
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account Has been Deleted")
      } catch (error) {
          return res.status(500).json("error")
      }
    } else {
      res.status(403).send("you can only delete your account only");
    }
  });

// get user

route.get('/:id' , async (req , res)=>{
        try {
            const user = await User.findById(req.params.id)
            const {password , updateAt , ...other} = user._doc
            res.status(200).json(other)
        } catch (error) {
            res.status(500).json("User Not Found")
        }
})


route.put("/:id/follow" , async (req ,res)=>{
    if (req.body.userID !== req.params.id) {
        try {
            const userToFollow = await User.findById(req.params.id)
            const userToBeFollowed = await User.findById(req.body.userID)
            
            if(!userToFollow.followers.includes(req.body.userID)){
                await userToFollow.updateOne({$push : {followers :req.body.userID}}) 
                await userToBeFollowed.updateOne({$push : {following :req.params.id}}) 
                res.status(200).json("User has been followed")
            }else{
                res.status(403).json("You already Followed him")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You Can't Follow Yourself")
    }
})

route.put("/:id/unfollow" , async (req ,res)=>{
    if (req.body.userID !== req.params.id) {
        try {
            const userToUnFollow = await User.findById(req.params.id)
            const userToBeUnFollowed = await User.findById(req.body.userID)
            
            if(userToUnFollow.followers.includes(req.body.userID)){
                await userToUnFollow.updateOne({$pull : {followers :req.body.userID}}) 
                await userToBeUnFollowed.updateOne({$pull : {following :req.params.id}}) 
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You Don't Followed him")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }else{

        res.status(403).json("You Can't UnFollow Yourself")
    }
})

route.get("/", (req, res) => {
  res.send("FROM USERS");
});

module.exports = route;
