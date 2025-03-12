const mongoose = require("mongoose")
const crypto = require("node:crypto")

exports.encryptPassword = async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.salt = crypto.randomBytes(8).toString("hex");

  this.password = crypto.scryptSync(this.password, this.salt, 8).toString("hex");

  next();
}

