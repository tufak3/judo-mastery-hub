import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

// Начальные данные для контактов
const DEFAULT_CONTACTS = {
    address: 'Не указан',
    phone: 'Не указан',
    worktime: 'Не указан',
    vk: '',
    telegram: '',
    whatsapp: ''
};

const contactsService = {
    // Получить все контактные данные
    getContacts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contacts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            // Возвращаем дефолтные данные в случае ошибки
            return { ...DEFAULT_CONTACTS };
        }
    },

    // Обновить контактные данные
    updateContacts: async (contactData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/contacts`, contactData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating contacts:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Ошибка при обновлении контактных данных'
            };
        }
    },

    // Обновить отдельное поле
    updateContactField: async (field, value) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/contacts/${field}`, { value });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating contact field:', error);
            return {
                success: false,
                error: 'Ошибка при обновлении поля'
            };
        }
    }
};

export default contactsService; 