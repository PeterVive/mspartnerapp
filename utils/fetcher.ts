export const fetcher = async (url: RequestInfo) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    const errorResponse = await res.json();
    error.message = errorResponse.errorMessage;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default fetcher;
