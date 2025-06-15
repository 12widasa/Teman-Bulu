import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role_id;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
