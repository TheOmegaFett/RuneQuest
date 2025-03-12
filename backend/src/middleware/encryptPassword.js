const mongoose = require("mongoose")
const crypto = require("node:crypto")

exports.encryptPassword = function(password) {

  salt = crypto.randomBytes(12).toString("hex");

  password = crypto.scryptSync(password, salt, 12).toString("hex");

  return {password, salt}
};

