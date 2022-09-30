const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../model/User");

//@route GET api/auth
//@desc Check if user is logged in
//access Public

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.UserId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error!!!" });
  }
});

//@route POST api/auth/register
//@desc Register user
//access Public

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  //Simple Validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  try {
    // Check for existing user
    const user = await User.findOne({ username });
    console.log(username);
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });

    //All good
    const hashedPassword = await bcrypt.hash(password, 0);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log(newUser);

    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error!!!" });
  }
});

//@route POST api/auth/login
//@desc Login user
//access Public

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  //Simple Validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  try {
    //Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //Username found
    const passswordValid = bcrypt.compare(user.password, password);
    if (!passswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    //All good
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
