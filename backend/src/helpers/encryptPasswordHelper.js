const mongoose = require("mongoose")
const crypto = require("node:crypto")

/**
 * Helper function to encrypt a password
 * @param {String} password - The user's password
 * @param {String} salt - The user's salt
 * @returns {Object} Encrypted password and salt
 */

exports.encryptPassword = function (password) {

  salt = crypto.randomBytes(64).toString("hex");

  password = crypto.scryptSync(password, salt, 64).toString("hex");

  return { password, salt }
};

