export async function parseJsonBody(request) {
  const text = await request.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const err = new Error('Request body is not valid JSON.');
    err.cause = error;
    throw err;
  }
}
