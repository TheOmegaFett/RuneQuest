const express = require("express");
const {
    getAllUsers,
    getOneUser,
    registerUser,
    updateUser,
    deleteUser,
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

// PATCH /users/settings/:userId - Update user data
router.patch("/update/:userId", updateUser)

// DELETE /users/delete/:id - Remove specific user
router.delete("/delete/:userId", deleteUser);


module.exports = router;