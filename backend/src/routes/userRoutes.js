const express = require("express");
const {
  getAllUsers,
  getOneUser,
  registerUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userController");
const {
  updateUserSettings,
  updateUserProgress,
} = require("../controllers/userUpdateController");

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

// DELETE /users/delete/:id - Remove specific user
router.delete("/delete/:userId", deleteUser);

// DELETE /users/deleteAll - Remove all users - dev only
router.delete("/deleteAll", deleteAllUsers);

// PATCH /users/settings/:userId - Update user settings data
router.patch("/settings/login/:userId", updateUserSettings);

// PATCH /users/settings/:userId - Update user progress data
router.patch("/settings/progress/:userId", updateUserProgress);

module.exports = router;