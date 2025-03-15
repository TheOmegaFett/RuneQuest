const jwt = require("jsonwebtoken");
const User = require("../models/User")

// Check for user authorisation
exports.checkAuthority = async function (req, res, next) {
  try {
    // Check if token exists
    let token = req.get("authorization"); // Bearer the-actual-token
    token = token?.split(" ")?.[1]; // the-actual-token

    // Check if token matches
    const payload = jwt.verify(token, "secret");
    req.userId = payload.id;

    // Check for admin rights
    try {
      const user = await User.findById(payload.id);
      req.isAdmin = user.isAdmin;
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Unauthorised - need login",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorised - need login",
    });
  }
};