import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { useEffect } from "react";
import Layout from "./Layout";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div
        className="mx-6 mt-10 rounded-lg px-6 py-10 text-center shadow"
        style={{ backgroundColor: "#E8D8C4" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "#561C24" }}>
          Selecciona una opción del menú para comenzar
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#6D2932" }}>
          Usa el menú de arriba para navegar entre los módulos de Tipos de Arte y Obras de Arte.
        </p>
      </div>
    
  </Layout>
  );
};

export default Dashboard;
