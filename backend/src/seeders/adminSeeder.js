const prompt = require("prompt-sync")();
const { encryptPassword } = require("../functions/encryptPassword");
const User = require("../models/User");


const seedDefaultAdmin = async () => {
  try {
    const passwordInput = prompt("Password for default user: ");
  
    saltPass = encryptPassword(passwordInput)

    const systemAdmin = {
      username: "SystemAdmin",
      password: saltPass["password"],
      salt: saltPass["salt"],
      isAdmin: true,
    };

    let existingAdmin = await User.findOneAndDelete({
      username: systemAdmin.username
    });

    if (!existingAdmin) {
      adminUser = await User.create(systemAdmin);
      console.log("Default admin successfully seeded");
    };
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

module.exports = seedDefaultAdmin;