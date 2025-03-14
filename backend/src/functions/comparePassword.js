const crypto = require("node:crypto");

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