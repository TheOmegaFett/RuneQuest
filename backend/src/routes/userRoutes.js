const express = require("express");
const {
    registerUser,
} = require("../controllers/userController");

const router = express.Router();

/**
 * Router for handling user-related endpoints
 * Base path: /users
 * Manages CRUD operations for users including their progression and preferences
 */

// GET /runes - Retrieve all users


// POST /users/create - Create a new user with username and password
router.post("/register", registerUser);

module.exports = router;