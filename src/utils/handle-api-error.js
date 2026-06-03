export const handleApiError = (
  error,
  setError,
  fallbackMessage = "Something went wrong. Please try again."
) => {
  const responseData = error.response?.data;

  if (responseData?.errors) {
    responseData.errors.forEach((err) => {
      setError(err.field || "root", {
        type: "server",
        message: err.message,
      });
    });

    return;
  }

  setError("root", {
    type: "server",
    message: responseData?.message || error.message || fallbackMessage,
  });
};