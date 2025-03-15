const jwt = require("jsonwebtoken");

/**
 * Helper function to create a JWT token
 * @param {String} userId - The user's ID
 * @returns {String} JWT token
 */

exports.createToken = function (userId) {
  return jwt.sign({ id: userId }, "secret");
};
