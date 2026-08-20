export async function fetchAllUsers() {
  const api = 'https://mindx-mockup-server.vercel.app/api/resources/users?apiKey=689f647d95f60a227657fefc';
  const response = await fetch(api, { method: 'GET' });
  const result = await response.json();
  return result.data.data || [];
}

export async function fetchAllCars() {
      const api =
    "https://mindx-mockup-server.vercel.app/api/resources/cardata?apiKey=689f647d95f60a227657fefc";
  const response = await fetch(api, { method: "GET" });
  const result = await response.json();
  const actual = result.data.data;
  return actual;
}

export async function fetchSpecificUser() {
  const userEmail = localStorage.getItem("account");
  try {
    const users = await fetchAllUsers();
    const user = users.find((user) => user.email === userEmail);
    return user || null;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function adminFetchSpecificUser(email) {
  try {
    const users = await fetchAllUsers();
    const user = users.find((user) => user.email === email);
    return user || null;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}