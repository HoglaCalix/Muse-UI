import { API_BASE_URL, handleResponse } from "./api.js";

export const artTypeService = {
    getAll: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art_type`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener tipos de arte:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art_type/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener tipo de arte:', error);
            throw error;
        }
    },

    create: async (artType) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art_type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    arttypetname: artType.arttypetname?.trim(),
                    typedescription: artType.typedescription?.trim(),
                    active: artType.active ?? true
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear tipo de arte:', error);
            throw error;
        }
    },

    update: async (id, artType) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art_type/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    arttypetname: artType.arttypetname?.trim(),
                    typedescription: artType.typedescription?.trim(),
                    active: artType.active
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar tipo de arte:', error);
            throw error;
        }
    },

    deactivate: async (art_type_id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art_type/${art_type_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar tipo de arte:', error);
            throw error;
        }
    }
};
