export const getErrorMessage = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request took too long. Check your connection and try again.";
    }
    return "Unable to reach the server. Check your internet connection.";
  }

  const { status, data } = error.response;

  if (data?.details?.length) {
    return data.details.map((detail) => detail.message).join(" ");
  }

  if (status === 401) {
    return "Your session has expired, please sign in again.";
  }
  if (status === 403) {
    return "You are not allowed to perform this action.";
  }
  if (status === 404) {
    return "Resource not found.";
  }
  if (status >= 500) {
    return "The server is having trouble. Please try again later.";
  }

  return data?.error || data?.message || "Something went wrong.";
};
