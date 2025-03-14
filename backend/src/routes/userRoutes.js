const express = require("express");
const router = express.Router();
const { checkAuthority } = require("../middleware/checkAuthority");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getOneUser,
  updateUserSettings,
  updateUserToAdmin,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userController");

/**
 * Router for handling user-related endpoints
 * Base path: /users
 * Manages CRUD operations for users including their progression and preferences
 */

// Public routes (no authentication required)
router.post("/register", registerUser);
router.get("/login", loginUser);

// Protected routes (authentication required)
router.get("/", checkAuthority, getAllUsers);
router.get("/one/:userId", checkAuthority, getOneUser);
router.patch("/settings/:userId", checkAuthority, updateUserSettings);
router.patch("/settings/admin/:userId", checkAuthority, updateUserToAdmin);
router.delete("/delete/:userId", checkAuthority, deleteUser);
router.delete("/deleteAll", checkAuthority, deleteAllUsers);

module.exports = router;
