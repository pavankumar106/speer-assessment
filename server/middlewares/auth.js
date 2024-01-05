const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
   
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    // verify token
    try {
      await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "error while validating token",
            error: err.message,
          });
        }

        req.user = decode;
      });
      // console.log(decode);
      // req.user = decode;
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Token invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};
