import { useNavigate } from "react-router-dom"
import { useAuth } from "../src/context/AuthContext"
import { useEffect } from "react"

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, validateToken } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) {
                clearInterval(interval);
            }
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    }


return(
<div className="min-h-screen" style={{ backgroundColor: "#7A2B34" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shadow"
        style={{ backgroundColor: "#6D2932" }}
      >
        <div>
          <h1
            className="text-xl font-bold text-glow"
            style={{ color: "#E8D8C4" }}
          >
            ¡Bienvenido a la MUSE! <span role="img" aria-label="lupa">🎨</span>
          </h1>
          <p className="text-lg" style={{ color: "#C7B7A3" }}>
            Hola {`${user.firstname}`}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded transition font-semibold"
          style={{
            backgroundColor: "#E8D8C4",
            color: "#561C24",
            boxShadow: "0 0 8px #E8D8C4aa",
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        className="flex space-x-6 border-b px-6 pt-4"
        style={{ backgroundColor: "#6D2932", borderColor: "#E8D8C4" }}
      >
        {/* Tab - Tipos (activo) */}
        <button
          className="flex items-center gap-2 border-b-2 font-semibold pb-2"
          style={{ color: "#E8D8C4" }}
          onClick={() => navigate("/art-type")}
        >
         
          Tipos de Arte
        </button>

        {/* Tab - Productos (inactivo) */}
        <button className="flex items-center gap-2 border-b-2 font-semibold pb-2"
          style={{ color: "#E8D8C4" }}
          onClick={() => navigate("/art")}>
          Obras de Arte
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </div>
</div>
)
}

export default Layout;