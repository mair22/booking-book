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
  const { title, description, url, chapter, author, status } = req.body;

  //Simple Validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is require!!" });
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "CONTINUE",
      author,
      chapter,
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

//@route PUT api/posts
//@desc Update posts
//@access Private
router.put("/:id", verifyToken, async(req, res) => {
  const { title, description, url, chapter, author, status } = req.body;

  //Simple Validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is require!!" });
  try {
    let updatedPost = ({
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "CONTINUE",
    });

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    //User not authorized to updated post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });

    res.json({ success: true, message: "Updated Success!!", post: updatedPost });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error!!!" });
  }
});

module.exports = router;
