import { API_BASE_URL, handleResponse } from "./api.js";

export const artService = {
    getAll: async (skip = 0, limit = 5) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener artes:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener arte:', error);
            throw error;
        }
    },

    create: async (art) => {
        try {
            
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_art_type: art.id_art_type,
                    title: art.title?.trim(),
                    description: art.description?.trim(),
                    image_url: art.image_url?.trim(),
                    creation_date: art.creation_date,
                    active: art.active ?? true
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear arte:', error);
            throw error;
        }
    },

    update: async (id, art) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_art_type: art.id_art_type,
                    title: art.title?.trim(),
                    description: art.description?.trim(),
                    image_url: art.image_url?.trim(),
                    creation_date: art.creation_date,
                    active: art.active
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar arte:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/art/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar arte:', error);
            throw error;
        }
    }
};
