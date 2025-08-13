import { useState, useEffect } from 'react';
import { artTypeService } from '../src/services/artTypeService'; 
import { useAuth } from '../src/context/AuthContext';
import Layout from './Layout';
import ArtTypeForm from './ArtTypeForm';

const ArtTypesList = () => {
    const [artTypes, setArtTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadArtTypes();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => setRecentlyUpdated(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadArtTypes = async () => {
        if (!validateToken()) return;
        try {
            setLoading(true);
            setError('');
            const data = await artTypeService.getAll();
            const artTypesArray = Array.isArray(data) ? data : [data];
            setArtTypes(artTypesArray);
            console.log('Tipos de arte cargados:', artTypesArray);
        } catch (error) {
            console.error('Error al cargar tipos de arte:', error);
            setError(error.message || 'Error al cargar los tipos de arte');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDeactivate = async (item) => {
        if (!validateToken()) return;

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar el tipo de arte "${item.arttypetname}"?
            Si este tipo de arte tiene obras asociadas, no podrás eliminarlo.`
        );

        if (confirmed) {
            try {
                setError('');
                await artTypeService.deactivate(item.id_arttype);
                await loadArtTypes();
                setSuccessMessage('Tipo de arte eliminado exitosamente');
            } catch (error) {
                console.error('Error al procesar:', "Este tipo de arte tiene asignado obras de arte. No es posible borrarlo.");
                setError(error.message || "Este tipo de arte tiene asignado obras de arte. No es posible borrarlo.");
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadArtTypes();
        setRecentlyUpdated(savedItem.id_arttype);
        setSuccessMessage(isEdit ? 'Tipo de arte actualizado exitosamente' : 'Tipo de arte creado exitosamente');
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-[#6D2932]">Cargando tipos de arte...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#561C24] text-glow">Tipos de Arte</h1>
                <button
                    onClick={handleCreate}
                    className="bg-[#561C24] hover:bg-[#6D2932] text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Tipo
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-[#E8D8C4] shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-[#C7B7A3]">
                    <thead className="bg-[#C7B7A3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#561C24] uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#561C24] uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#561C24] uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#561C24] uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#561C24] uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#E8D8C4] divide-y divide-[#C7B7A3]">
                        {artTypes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-[#6D2932]">
                                    No hay tipos de arte registrados
                                </td>
                            </tr>
                        ) : (
                            artTypes.map((item) => (
                                <tr
                                    key={item.id_arttype}
                                    className={`hover:bg-[#C7B7A3] transition-colors ${
                                        recentlyUpdated === item.id_arttype ? 'bg-green-50 border-l-4 border-green-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#561C24]">{item.id_arttype}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#561C24]">{item.arttypetname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#561C24]">{item.typedescription}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-700 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDeactivate(item)}
                                                style={{ color: '#9B2C2C' }}
                                                className="hover:text-[#561C24]"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ArtTypeForm
                    item={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default ArtTypesList;
