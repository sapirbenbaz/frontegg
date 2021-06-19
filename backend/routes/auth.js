const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

// Registration
router.post("/register", async (req, res) => {
  // Validating the data before creating a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Checking if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ message: "Email already exists" });

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    status: "Working",
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({ message: "User created!", user: user._id });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  // Validating the data before logging a user in
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Checking if the email exists in the database
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user)
    return res.status(400).json({ message: "Email or password is wrong" });

  // Assuring password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Email or password is wrong" });

  // Creating a Json Web Token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).json({ token: token });
});

module.exports = router;
