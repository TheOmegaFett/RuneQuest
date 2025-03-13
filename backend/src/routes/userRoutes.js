const express = require("express");
const { checkAuthority } = require("../middleware/checkAuthority");
const {
  getAllUsers,
  getOneUser,
  registerUser,
  loginUser,
  deleteUser,
  deleteAllUsers,
  updateUserSettings,
} = require("../controllers/userController");

const router = express.Router();

/**
 * Router for handling user-related endpoints
 * Base path: /users
 * Manages CRUD operations for users including their progression and preferences
 */

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.get("/", checkAuthority, getAllUsers);
router.get("/one/:userId", checkAuthority, getOneUser);
router.patch("/settings/login/:userId", checkAuthority, updateUserSettings);
router.delete("/delete/:userId", checkAuthority, deleteUser);
router.delete("/deleteAll", checkAuthority, deleteAllUsers);

module.exports = router;
