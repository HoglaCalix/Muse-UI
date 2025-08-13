
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { validatePassword, isValidEmail, getPasswordStrength } from "../src/utils/validators";
const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth(); // Removemos loading del contexto para el signup también
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const handleSignup = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }
        
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.lastname.trim()) {
            setError('El apellido es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }
        
        // Validación de formato de email
        if (!isValidEmail(formData.email)) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }
        
        // Validaciones de contraseña
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setIsSubmitting(false);
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await register(formData.name, formData.lastname, formData.email, formData.password);
            if (result) {
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');

                // Limpiar formulario
                setFormData({
                    name: '',
                    lastname: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });


                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
       <div className="min-h-screen bg-[#E8D8C4] flex items-center justify-center p-4">
  <div className="bg-[#C7B7A3] p-8 rounded-lg shadow-md w-full max-w-md">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[#561C24] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-[#E8D8C4]">🎨</span>
      </div>
      <h1 className="text-2xl font-bold text-[#E8D8C4] text-glow">Muse</h1>
      <p className="text-[#6D2932]">Crear cuenta nueva</p>
    </div>

    {/* Mensajes de error y éxito */}
    {error && (
      <div
        className={`mb-4 p-3 rounded-md border ${
          error.includes('email ya está registrado') || error.includes('usuario ya existe')
            ? 'bg-[#C7B7A3] border-[#6D2932] text-[#561C24]'
            : 'bg-[#E8D8C4] border-[#561C24] text-[#561C24]'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2">
            {error.includes('email ya está registrado') || error.includes('usuario ya existe') ? '⚠️' : '❌'}
          </span>
          <span>{error}</span>
        </div>
        {(error.includes('email ya está registrado') || error.includes('usuario ya existe')) && (
          <div className="mt-2 text-sm">
            <Link to="/login" className="underline" style={{ color: '#561C24', hover: { color: '#6D2932' } }}>
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        )}
      </div>
    )}

    {success && (
      <div className="mb-4 p-3 bg-[#C7B7A3] border border-[#561C24] text-[#561C24] rounded-md">
        <div className="flex items-center">
          <span className="mr-2">✅</span>
          <span>{success}</span>
        </div>
      </div>
    )}

    {/* Formulario */}
    <form className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#561C24] mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#6D2932] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
            placeholder="Juan"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-[#561C24] mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#6D2932] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
            placeholder="Pérez"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#561C24] mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#6D2932] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
          placeholder="usuario2@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#561C24] mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#6D2932] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
          placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
        />
      {formData.password && (
                            <div className="mt-2">
                                <div className="text-xs  mb-1">Requisitos de contraseña:</div>
                                <div className="space-y-1">
                                    {(() => {
                                        const strength = getPasswordStrength(formData.password);
                                        return (
                                            <>
                                                <div className={`text-xs flex items-center ${strength.isValidLength ? 'text-green-600' : 'text-white-400'}`}>
                                                    <span className="mr-1">{strength.isValidLength ? '✓' : '○'}</span>
                                                    8-64 caracteres
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasUppercase ? 'text-green-600' : 'text-white-400'}`}>
                                                    <span className="mr-1">{strength.hasUppercase ? '✓' : '○'}</span>
                                                    Al menos una mayúscula
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasNumber ? 'text-green-600' : 'text-white-400'}`}>
                                                    <span className="mr-1">{strength.hasNumber ? '✓' : '○'}</span>
                                                    Al menos un número
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasSpecialChar ? 'text-green-600' : 'text-white-400'}`}>
                                                    <span className="mr-1">{strength.hasSpecialChar ? '✓' : '○'}</span>
                                                    Carácter especial (@$!%*?&)
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
       
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#561C24] mb-1">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#6D2932] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
          placeholder="Confirma tu contraseña"
        />
      </div>

      <button
        type="button"
        onClick={handleSignup}
        disabled={isSubmitting}
        className="w-full bg-[#561C24] text-[#E8D8C4] py-2 px-4 rounded-md hover:bg-[#6D2932] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>

    {/* Link de login */}
    <p className="text-center text-sm" style={{ color: '#6D2932', marginTop: '1rem' }}>
      ¿Ya tienes cuenta?{" "}
      <Link to="/login" className="underline text-[#6D2932]  text-glow" >
        Inicia sesión
      </Link>
    </p>
  </div>
</div>
    )

};

export default SignupScreen;
