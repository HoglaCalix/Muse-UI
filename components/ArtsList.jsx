import { useState, useEffect } from 'react';
import { artService } from '../src/services/artService';
import { artTypeService } from '../src/services/artTypeService';
import { useAuth } from '../src/context/AuthContext';
import Layout from './Layout';
import ArtForm from './ArtForm';



const ArtsList = () => {
    const [arts, setArts] = useState([]);
    const [artTypes, setArtTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadData();
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

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const artsData = await artService.getAll();
            setArts(Array.isArray(artsData) ? artsData : [artsData]);

            try {
                const artTypesData = await artTypeService.getAll();
                setArtTypes(artTypesData);
            } catch (typeError) {
                console.warn('Error al cargar tipos de arte:', typeError);
                setArtTypes([]);
            }

        } catch (error) {
            console.error('Error al cargar artes:', error);
            setError(error.message || 'Error al cargar las obras de arte');
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

    const handleDelete = async (item) => {
        if (!validateToken()) return;

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar la obra de arte "${item.title}"?`
        );

        if (confirmed) {
            try {
                setError('');
                await artService.deactivate(item.id_art);
                await loadData();
                setSuccessMessage('Obra de arte eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar arte:', error);
                setError(error.message || 'Error al eliminar la obra de arte');
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        setRecentlyUpdated(savedItem.id_art);
        setSuccessMessage(isEdit ? 'Obra de arte actualizada exitosamente' : 'Obra de arte creada exitosamente');
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };
    const getArtTypeName = (art) => {
    return art.arttypetname || art.id_art_type || 'Sin tipo';
}


   const palette = {
    darkBurgundy: '#561C24',
    mediumBurgundy: '#6D2932',
    lightBrown: '#C7B7A3',
    cream: '#E8D8C4',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: palette.cream }}>
        <div style={{ color: palette.mediumBurgundy }} className="text-lg">Cargando obras de arte...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: palette.darkBurgundy }} className="text-3xl font-bold text-glow">Obras de Arte</h1>
        <button
          onClick={handleCreate}
          style={{ backgroundColor: palette.mediumBurgundy }}
          className="text-white font-medium py-2 px-4 rounded-md transition-colors hover:brightness-110"
        >
          + Nueva Obra
        </button>
      </div>

      {successMessage && (
        <div
          className="mb-4 p-3 rounded-md"
          style={{ backgroundColor: palette.lightBrown, border: `1px solid ${palette.mediumBurgundy}`, color: palette.darkBurgundy }}
        >
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-4 p-3 rounded-md"
          style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', color: '#842029' }}
        >
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: palette.cream, boxShadow: `0 0 10px ${palette.mediumBurgundy}` }} className="rounded-lg overflow-hidden">
        <table className="min-w-full divide-y" style={{ borderColor: palette.lightBrown }}>
          <thead style={{ backgroundColor: palette.lightBrown }}>
            <tr>
              {['Título', 'Descripción', 'Fecha de Creación', 'Tipo', 'Imagen', 'Estado', 'Acciones'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: palette.darkBurgundy }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: palette.cream }}>
            {arts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center" style={{ color: palette.mediumBurgundy }}>
                  No hay obras de arte registradas
                </td>
              </tr>
            ) : (
              arts.map((item) => (
                <tr
                  key={item.id_art}
                  className={`hover:bg-[#C7B7A3] transition-colors`}
                  style={{
                    backgroundColor: recentlyUpdated === item.id_art ? '#E8D8C4' : palette.cream,
                    borderLeft: recentlyUpdated === item.id_art ? `4px solid ${palette.mediumBurgundy}` : 'none',
                    color: palette.darkBurgundy,
                  }}
                >
                  <td className="px-6 py-4 text-sm">{item.title}</td>
                  <td className="px-6 py-4 text-sm">{item.description}</td>
                  <td className="px-6 py-4 text-sm">{item.creation_date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: palette.mediumBurgundy, color: palette.cream }}
                    >
                      {getArtTypeName(item)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="h-12 rounded" />
                    ) : (
                      <span style={{ color: palette.mediumBurgundy }}>Sin imagen</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ color: palette.mediumBurgundy }}
                      className="hover:text-[#561C24] mr-3"
                    >
                      Editar
                    </button>
                    {item.active && (
                      <button
                        onClick={() => handleDelete(item)}
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
        <ArtForm
          item={editingItem}
          artTypes={artTypes}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </Layout>
  );
};

export default ArtsList;
