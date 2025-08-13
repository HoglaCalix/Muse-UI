import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const {isAuthenticated, loading} = useAuth();
    if (loading) {
       return (
      <div className="spinner-custom relative">
         <div className="spinner-custom relative">
  <span
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    style={{ color: "#E8D8C4", fontSize: "1.5rem" }}
    role="img"
    aria-label="art emoji"
  >
    🎨
  </span>
</div>

        <span
          className="block mt-4"
          style={{ color: "#E8D8C4", fontWeight: "600" }}
        >
          Cargando...
        </span>
      </div>
    );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;