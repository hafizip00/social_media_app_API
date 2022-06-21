const route = require("express").Router();
const Posts = require("../models/Post");
const User = require('../models/User')

// create a post
route.post("/createpost", async (req, res) => {
  const newPost = new Posts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a post

route.put("/:id", async (req, res) => {
  const post = await Posts.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await Posts.updateOne({ $set: req.body });
      res.status(200).json("UPDATED POST");
    } else {
      res.status(403).json("Youu can only update your post");
    }
  } catch (error) {
    res.status(500).json("error");
  }
});

// delete post

route.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Posts.findByIdAndDelete(req.params.id);
      res.status(200).json("Post Deleted Succesfully");
    } else {
      res.status(403).json("You can Only Delete Your Post");
    }
  } catch (error) {
    res.status.json(error);
  }
});
// like post

route.put("/:id/like", async (req, res) => {
  const post = await Posts.findById(req.params.id);
  try {
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post hase been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("you disliked that post");
    }
  } catch (error) {
    res.status(500).json("error");
  }
});
// get a post

route.get('/:id' , async (req,res)=>{
    const post = await Posts.findById(req.params.id);
    try {
      if (post) {
        res.status(200).json(post)
      }else{
        res.status(404).json("Post Not Found")
      }
    } catch (error) {
      res.status(500).json("error")
    }
})
// get timeline posts

route.get("/timeline" , async (req , res)=>{
  const postsArray = [];
  try {
    const user = await User.find({userId : req.body.userId})
    const UserPosts = await Posts.find({userId : user._id})
  } catch (error) {
    res.status(403).json("Error")
  }
})
route.get("/home", (req, res) => {
  res.send("POATAA");
});

module.exports = route;
