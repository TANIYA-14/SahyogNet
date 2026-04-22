const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const createNeed = async (data) => {
  const res = await fetch(`${API_URL}/needs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getNeeds = async () => {
  const res = await fetch(`${API_URL}/needs`);
  return res.json();
};

export const getNeedById = async (id) => {
  const res = await fetch(`${API_URL}/needs/${id}`);
  return res.json();
};

export const getMatches = async (needId) => {
  const res = await fetch(`${API_URL}/matches/${needId}`);
  return res.json();
};

export const createAssignment = async (data) => {
  const res = await fetch(`${API_URL}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
