const User = require("../models/User");

/**
 * Helper function to validate password
 * @param {string} password - The password to validate
 * @returns {boolean} True if password is valid, false otherwise
 */

exports.validateUserDetails = function (username, password) {
  const usernameMin = 3;
  const usernameMax = 20;
  const passwordMin = 6;

  switch (true) {
    case password.length < passwordMin:
      return { error: `Password must be at least ${passwordMin} characters` };
    case username.length <= usernameMin:
      return { error: `Username must be at least ${usernameMin} characters` };
    case username.length >= usernameMax:
      return { error: `Username must be less than ${usernameMax} characters` };
    default:
      return true;
  }
};