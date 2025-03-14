const mongoose = require("mongoose")
const crypto = require("node:crypto")

exports.encryptPassword = function(password) {

  salt = crypto.randomBytes(64).toString("hex");

  password = crypto.scryptSync(password, salt, 64).toString("hex");

  return {password, salt}
};

