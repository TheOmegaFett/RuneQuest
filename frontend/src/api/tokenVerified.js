const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const tokenVerified = async (token) => {
  try {
    console.log("Checking jwt validity....");

    let targetUrl = `${API_URL}/api/users/verify`;

    let response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
      },
    });

    let apiResponse = await response.json();
    if (apiResponse.success) {
      console.log("Token valid!")
      sessionStorage.setItem("userId", apiResponse.data.id)
      console.log("User Id saved to global state.")
    } else {
      console.error("Token not valid, deleting and refreshing....");
      sessionStorage.removeItem("jwt");
      window.location.reload(false);
    }
  } catch (error) {
    console.error(error.message)
  }
}