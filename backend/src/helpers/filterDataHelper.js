/**
 * Helper function to filter user data
 * @param {Object} userData - The user's data
 * @returns {Object} Filtered user data
 */

exports.filterUserData = function (userData) {
  return {
    id: userData.id,
    username: userData.username,
    isAdmin: userData.isAdmin,
    preferences: userData.preferences,
    progress: userData.progress,
  }
};