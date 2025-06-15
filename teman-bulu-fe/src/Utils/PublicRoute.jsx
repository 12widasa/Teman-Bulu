import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserRole } from "./auth";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp > now) {
        const role = getUserRole();
        
        if (role === 1) return <Navigate to="/admin-data-buyer" />;
        if (role === 2) return <Navigate to="/daftar-pesanan" />;
        if (role === 3) return <Navigate to="/landingpage" />;
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  }

  return children;
};

export default PublicRoute;
