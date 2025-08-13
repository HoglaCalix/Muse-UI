import { useState } from "react";   
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        if (!email.trim()) {
            setError('El email es requerido');
             return setIsSubmitting(false);
            
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#561C24] items-center justify-center">
            <div className="relative w-full max-w-xs bg-[#6D2932] rounded-xl p-6 shadow-2xl transform transition duration-300 hover:scale-105">
                <header>
                    <img
                        className="w-20 mx-auto mb-6 animate-spin-slow"
                        src="https://cdn.pixabay.com/photo/2015/05/11/22/11/musical-notes-763190_1280.png"
                        alt="logo"
                    />
                    <h1 className="text-2xl font-bold text-[#E8D8C4] text-glow">Muse</h1>
                </header>

                 {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        <div className="flex items-center">
                            <span className="mr-2">❌</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <form className="mt-4" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-2 text-[#C7B7A3]" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full p-2 rounded bg-[#C7B7A3] placeholder-[#4A171E] text-[#561C24] border-b-2 border-[#E8D8C4] outline-none focus:bg-[#E8D8C4] focus:text-[#561C24] transition"
                            type="email"
                            id="email"
                            placeholder="tucorreo@gmail.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                
                            }}
                            
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-[#C7B7A3]" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full p-2 rounded bg-[#C7B7A3] placeholder-[#4A171E] text-[#561C24] border-b-2 border-[#E8D8C4] outline-none focus:bg-[#E8D8C4] focus:text-[#561C24] transition"
                            type="password"
                            id="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                
                            }}
                           
                        />
                    </div>
                    <div>
                        <button
                        style={{
                          
                            boxShadow: "0 0 8px #E8D8C4aa",
          }}
                           
                            type="submit"
                            className="w-full bg-[#E8D8C4] hover:bg-[#C7B7A3] text-[#561C24] font-bold py-2 px-4 rounded transition duration-300 shadow-md hover:shadow-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
                        </button>
                    </div>
                </form>

                <footer className="mt-4 text-center">
                    <span className="text-[#C7B7A3]">
                        No tienes una cuenta?{" "}
                        <Link to="/signup" className="underline text-[#E8D8C4] hover:text-white">
                            Regístrate
                        </Link>
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default LoginScreen;
