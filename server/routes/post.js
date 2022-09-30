const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");

//@route GET api/posts
//@desc GET posts
//@access Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
    console.log("posts", posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//@route POST api/posts
//@desc Create post
//@access Private

router.post("/", verifyToken, async (req, res) => {
  const { title, description, author, status } = req.body;

  //Simple Validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is require!!" });
  try {
    const newPost = new Post({
      title,
      description,
      status: status || "CONTINUE",
      author,
      user: req.userId,
    });

    await newPost.save();
    res.json({ success: true, message: "Creat Success", post: newPost });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error!!!" });
  }
});

module.exports = router;
