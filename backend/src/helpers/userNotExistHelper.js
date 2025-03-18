const User = require('../models/User');

exports.userNotExist = async function (username) {
    const user = await User.findOne({ username: username });
    if (user) {
        return { error: "Username already in use" };;
    } else {
        return false;
    }
};