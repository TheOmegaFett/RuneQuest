const express = require("express");
const {
    registerUser,
    getAllUsers,
    getOneUser,
} = require("../controllers/userController");

const router = express.Router();

/**
 * Router for handling user-related endpoints
 * Base path: /users
 * Manages CRUD operations for users including their progression and preferences
 */

// GET /users - Retrieve all users
router.get("/", getAllUsers);

// Get /users/one/:userId - Retrieve one user
router.get("/one/:userId", getOneUser);

// POST /users/create - Create a new user with username and password
router.post("/register", registerUser);

// PATCH /users/preferences - Update user preferences


// PATCH /users/progress - Update user progression


// PATCH /users/details - Update user username and password


// DELETE /users/delete/:id - Remove specific user



module.exports = router;