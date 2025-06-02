import jwt_decode from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded.role;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
