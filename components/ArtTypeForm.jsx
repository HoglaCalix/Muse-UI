import { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { artTypeService } from '../src/services/artTypeService';

const ArtTypeForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        arttypetname: item?.arttypetname || '',
        typedescription: item?.typedescription || '',
        active: item?.active ?? true
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateToken()) return;

        if (!formData.arttypetname.trim()) {
            setError('El nombre es requerido');
            return;
        }

        const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!pattern.test(formData.arttypetname)) {
            setError('El nombre solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }
        
        if (!pattern.test(formData.typedescription)) {
            setError('La descripcion solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }

        if (!formData.typedescription.trim()) {
            setError('La descripción es requerida');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await artTypeService.update(item.id_arttype, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await artTypeService.create(formData);
                if (!savedItem) {
                    savedItem = {
                        id_arttype: Date.now().toString(),
                        ...formData
                    };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el tipo de arte');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#E8D8C4] rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#561C24] mb-4">
                        {item ? 'Editar Tipo de Arte' : 'Nuevo Tipo de Arte'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="arttypetname" className="block text-sm font-medium text-[#561C24] mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="arttypetname"
                                name="arttypetname"
                                value={formData.arttypetname}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
                                placeholder="Ej: Escultura, Pintura"
                                maxLength="100"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="typedescription" className="block text-sm font-medium text-[#561C24] mb-1">
                                Descripción *
                            </label>
                            <textarea
                                id="typedescription"
                                name="typedescription"
                                value={formData.typedescription}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
                                placeholder="Descripción del tipo de arte"
                                maxLength="300"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-[#561C24] focus:ring-[#6D2932] border-[#C7B7A3] rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-[#561C24]">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-[#561C24] bg-[#E8D8C4] hover:bg-[#C7B7A3] rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#561C24] hover:bg-[#6D2932] rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtTypeForm;
