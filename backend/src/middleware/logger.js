const User = require("../models/User")

exports.logger = function (req, res, next) {
    // Log request info
    console.log(`Request info: ${req.method} ${req.url}`);
    next();
};