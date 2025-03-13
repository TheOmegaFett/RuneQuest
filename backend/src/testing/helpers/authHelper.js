const jwt = require("jsonwebtoken");

// Helper to generate test tokens
const generateTestToken = (userId = "123456789012") => {
  return jwt.sign({ id: userId }, "secret");
};

module.exports = { generateTestToken };
