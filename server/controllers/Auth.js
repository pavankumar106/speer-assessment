const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// ==================================== Sign Up controller ===============================================
exports.signup = async (req, res) => {
  try {
    // data from req.body
    const { name, email, password, confirmPassword } = req.body;
    // validate data
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password does not match",
      });
    }
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists...",
      });
    }

    // hash the password
    let hashedPassword;
    let salt = bcrypt.genSaltSync(10);
    try {
      hashedPassword = await bcrypt.hashSync(password, salt);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }
    // create user in db
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    newUser.password = undefined;
    // return response
    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// ============================================= Login controller =========================================
exports.login = async (req, res) => {
  try {
    // get email and password from req.body
    const { email, password } = req.body;
    // validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    // check if user exists
    let user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not registered",
      });
    }

    // verify password and generate jwt token
    if (await bcrypt.compareSync(password, user.password)) {
      const payload = {
        id: user._id,
        email: user.email,
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user = user.toObject();
      user.password = undefined;

      const options = {
        expiresIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password Not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:
        "User cannot be logged in. Something went wrong, please try again later...",
      error: error.message,
    });
  }
};
