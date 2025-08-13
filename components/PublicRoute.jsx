import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const PublicRoute = ({ children }) => {
    const {isAuthenticated, loading} = useAuth();
    if (loading) {
        return (
      <div
  className="min-h-screen flex items-center justify-center"
  style={{ backgroundColor: "#561C24" }}
>
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
</div>

    );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute;