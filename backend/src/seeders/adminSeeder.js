const { encryptPassword } = require("../functions/encryptPassword");
const User = require("../models/User");

saltPass = encryptPassword("Admin1")

systemAdmin = {
    username: "SystemAdmin",
    password: saltPass["password"],
    salt: saltPass["salt"],
    isAdmin: true,
};

const seedDefaultAdmin = async () => {
    try {
        let existingAdmin = await User.findOne({
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