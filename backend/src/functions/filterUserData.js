// Function for returning filtered userData to exclude password & salt
exports.filterUserData = function (userData) {
    return {
      id: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin,
      preferences: userData.preferences,
      progress: userData.progress,
    }
  };