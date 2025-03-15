const crypto = require("node:crypto");

/**
 * Helper function to compare a password
 * @param {String} password - The user's password
 * @param {String} salt - The user's salt
 * @returns {Object} Encrypted password and salt
 */

exports.comparePassword = function async(
  existingPassword,
  existingSalt,
  providedPassword
) {
  return crypto.scryptSync(
    providedPassword,
    existingSalt,
    64
  ).toString("hex") == existingPassword
};