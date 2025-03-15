const { encryptPassword } = require("../helpers/encryptPasswordHelper");
const User = require("../models/User");
require("dotenv").config();

const seedDefaultAdmin = async () => {
  try {
    // Get password from environment variable instead of prompt
    const passwordInput = process.env.ADMIN_PASSWORD;

    if (!passwordInput) {
      console.log(
        "No ADMIN_PASSWORD environment variable found. Admin seeding skipped."
      );
      return;
    }

    const saltPass = encryptPassword(passwordInput);

    const systemAdmin = {
      username: "SystemAdmin",
      password: saltPass["password"],
      salt: saltPass["salt"],
      isAdmin: true,
    };

    let existingAdmin = await User.findOneAndDelete({
      username: systemAdmin.username,
    });

    const adminUser = await User.create(systemAdmin);
    console.log("Default admin successfully seeded");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

module.exports = seedDefaultAdmin;
module.exports = seedDefaultAdmin;
