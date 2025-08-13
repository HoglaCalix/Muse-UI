import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { artService } from "../src/services/artService";

const ArtForm = ({ item, onSuccess, onCancel, artTypes }) => {

  const activeArtTypes = artTypes.filter(type => type.active);
  const { validateToken } = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  const initialIdArtType = item?.id_art_type || item?.id_arttype || (artTypes.length > 0 ? artTypes[0].id_arttype : "");

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    creation_date: formatDate(item?.creation_date),
    id_art_type: initialIdArtType || (artTypes.length > 0 ? artTypes[0].id_art_type : ""),
    image_url: item?.image_url || "",
    active: Boolean(item?.active ?? true),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("El título es obligatorio");
      return false;
    }
    if (!formData.description.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    if (!formData.creation_date) {
      setError("La fecha de creación es obligatoria");
      return false;
    }
    if (!formData.id_art_type) {
      setError("Debe seleccionar un tipo de arte");
      return false;
    }
    if (
      formData.image_url.trim() &&
      !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(formData.image_url.trim())
    ) {
      setError("La URL de la imagen no es válida");
      return false;
    }

    if (!formData.image_url) {
      setError("Ingrese una URL de imagen.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
      const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!pattern.test(formData.title)) {
            setError('El nombre solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }
        
        if (!pattern.test(formData.description)) {
            setError('La descripcion solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }


    console.log("Submitting form with data:", formData);
    if (isSubmitting) return;

    if (!validateToken()) {
      setError("Token inválido o expirado");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      setError("");
      let savedItem;
      if (item) {
        savedItem = await artService.update(item.id_art, formData);
        if (!savedItem) savedItem = { ...item, ...formData };
        onSuccess(savedItem, true);
      } else {
        savedItem = await artService.create(formData);
        if (!savedItem) {
          savedItem = { id_art: Date.now().toString(), ...formData };
        }
        onSuccess(savedItem, false);
      }
    } catch (e) {
      console.error("Error al guardar la obra de arte:", e);
      setError(e.message || "Error al guardar la obra de arte");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSubmitting) handleSubmit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#E8D8C4] rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#561C24] mb-4">
            {item ? "Editar Obra de Arte" : "Nueva Obra de Arte"}
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
              <label htmlFor="title" className="block text-sm font-medium text-[#561C24] mb-1">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
                maxLength="100"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#561C24] mb-1">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
                maxLength="300"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="creation_date" className="block text-sm font-medium text-[#561C24] mb-1">
                Fecha de creación *
              </label>
              <input
                type="date"
                id="creation_date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
              />
            </div>

            <div>
              <label htmlFor="id_art_type" className="block text-sm font-medium text-[#561C24] mb-1">
                Tipo de arte *
              </label>
              <select
                id="id_art_type"
                name="id_art_type"
                value={formData.id_art_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
              >
                <option value="">Seleccione un tipo</option>
                {activeArtTypes.map((type) => (
                  <option key={type.id_arttype} value={type.id_arttype}>
                    {type.arttypetname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-[#561C24] mb-1">
                URL de la imagen
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-[#C7B7A3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#561C24]"
                placeholder="https://example.com/imagen.jpg"
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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtForm;
