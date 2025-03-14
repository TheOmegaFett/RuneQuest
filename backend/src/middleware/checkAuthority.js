const jwt = require("jsonwebtoken");

exports.checkAuthority = function (req, res, next) {
  let token = req.get("authorization"); // Bearer the-actual-token
  token = token?.split(" ")?.[1]; // the-actual-token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorised",
    });
  }
  try {
    const payload = jwt.verify(token, "secret");
    req.userId = payload.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  };
};