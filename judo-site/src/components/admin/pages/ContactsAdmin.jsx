import React, { useState, useEffect } from 'react';
import { useContacts } from '../../../context/ContactsContext';
import './AdminPages.css';

const ContactsAdmin = () => {
    const { contacts, updateContacts, loading, error } = useContacts();
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        worktime: '',
        vk: '',
        telegram: '',
        whatsapp: '',
        email: ''
    });
    const [operationStatus, setOperationStatus] = useState({ message: '', type: '' });
    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        if (contacts) {
            setFormData(contacts);
        }
    }, [contacts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (field) => {
        setOperationStatus({ message: 'Сохранение...', type: 'info' });
        try {
            const result = await updateContacts({ [field]: formData[field] });
            if (result.success !== false) {
                setOperationStatus({
                    message: 'Данные успешно обновлены',
                    type: 'success'
                });
                setEditingField(null);
                if (result.data) {
                    setFormData(result.data);
                }
            } else {
                setOperationStatus({
                    message: result.error || 'Произошла ошибка при сохранении',
                    type: 'error'
                });
            }
        } catch (err) {
            setOperationStatus({
                message: 'Произошла ошибка при сохранении',
                type: 'error'
            });
        }
    };

    const handleEdit = (field) => {
        setEditingField(field);
        setOperationStatus({ message: '', type: '' });
    };

    const handleCancel = () => {
        setEditingField(null);
        setFormData(contacts);
        setOperationStatus({ message: '', type: '' });
    };

    if (loading) {
        return <div className="status-message info">Загрузка данных...</div>;
    }

    const renderField = (field, label, type = 'text', placeholder = '') => {
        const isEditing = editingField === field;
        const isTextarea = field === 'phone' || field === 'worktime';
        return (
            <div className="contact-item">
                <div className="contact-header">
                    <h3>{label}</h3>
                    {!isEditing && (
                        <button 
                            className="icon-button edit"
                            onClick={() => handleEdit(field)}
                        >
                            Изменить
                        </button>
                    )}
                </div>
                <div className="contact-content">
                    {isEditing ? (
                        <div className="edit-form">
                            {isTextarea ? (
                                <textarea
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleInputChange}
                                    className="admin-input"
                                    placeholder={placeholder}
                                    rows={4}
                                />
                            ) : (
                                <input
                                    type={type}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleInputChange}
                                    className="admin-input"
                                    placeholder={placeholder}
                                />
                            )}
                            <div className="button-group">
                                <button 
                                    className="primary-button"
                                    onClick={() => handleSubmit(field)}
                                >
                                    Сохранить
                                </button>
                                <button 
                                    className="secondary-button"
                                    onClick={handleCancel}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <pre className="contact-pre">{formData[field] || 'Не указано'}</pre>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="admin-page">
            <h2>Управление контактной информацией</h2>

            {error && (
                <div className="status-message error">
                    Ошибка: {error}
                </div>
            )}

            {operationStatus.message && (
                <div className={`status-message ${operationStatus.type}`}>
                    {operationStatus.message}
                </div>
            )}

            <div className="contacts-grid">
                {renderField('address', 'Адрес', 'text', 'Введите адрес')}
                {renderField('phone', 'Телефон', 'tel', 'Введите телефоны (каждый с новой строки)')}
                {renderField('worktime', 'Режим работы', 'text', 'Например: Пн-Пт: 9:00-18:00\nСб: 10:00-15:00')}
                {renderField('email', 'Email', 'email', 'example@email.com')}
                <div className="social-media-section">
                    <h3>Социальные сети</h3>
                    <div className="social-icons-admin">
                        {formData.vk && (
                            <a href={formData.vk} className="social-icon" target="_blank" rel="noopener noreferrer" title="ВКонтакте">
                                <i className="fab fa-vk"></i>
                            </a>
                        )}
                        {formData.telegram && (
                            <a href={formData.telegram} className="social-icon" target="_blank" rel="noopener noreferrer" title="Telegram">
                                <i className="fab fa-telegram"></i>
                            </a>
                        )}
                        {formData.whatsapp && (
                            <a href={formData.whatsapp} className="social-icon" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        )}
                        {formData.email && (
                            <a href={`mailto:${formData.email}`} className="social-icon" title="Email">
                                <i className="fas fa-envelope"></i>
                            </a>
                        )}
                    </div>
                    {renderField('vk', 'ВКонтакте', 'url', 'https://vk.com/...')}
                    {renderField('telegram', 'Telegram', 'url', 'https://t.me/...')}
                    {renderField('whatsapp', 'WhatsApp', 'url', 'https://wa.me/...')}
                </div>
            </div>
        </div>
    );
};

export default ContactsAdmin; 