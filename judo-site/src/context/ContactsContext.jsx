import React, { createContext, useContext, useState, useEffect } from 'react';
import contactsService from '../services/contactsService';

const ContactsContext = createContext(null);

export const ContactsProvider = ({ children }) => {
    const [contacts, setContacts] = useState({
        address: '',
        phone: '',
        email: '',
        workingHours: '',
        socialMedia: {
            vk: '',
            telegram: '',
            whatsapp: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadContacts = async () => {
        try {
            const data = await contactsService.getContacts();
            setContacts(data);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке контактных данных');
            console.error('Error loading contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateContacts = async (updatedContacts) => {
        try {
            const result = await contactsService.updateContacts(updatedContacts);
            if (result.success) {
                setContacts(result.data);
                return { success: true, data: result.data };
            } else {
                return { 
                    success: false, 
                    error: result.error || 'Ошибка при обновлении контактных данных' 
                };
            }
        } catch (err) {
            console.error('Error updating contacts:', err);
            return { 
                success: false, 
                error: 'Ошибка при обновлении контактных данных' 
            };
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    return (
        <ContactsContext.Provider value={{
            contacts,
            loading,
            error,
            updateContacts,
            refreshContacts: loadContacts
        }}>
            {children}
        </ContactsContext.Provider>
    );
};

export const useContacts = () => {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
}; 