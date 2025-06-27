export async function request(endpoint, options = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  return await res.json();
}
