import React, { useState, useEffect } from 'react';
import contactsService from '../services/contactsService';
import '../styles/contactsPage.css';
import '../styles/statusMessages.css';

function formatSocialLink(link, type) {
    if (!link) return '';
    if (/^https?:\/\//i.test(link)) return link;
    if (type === 'vk') return 'https://' + link.replace(/^\/+/, '');
    if (type === 'telegram') return 'https://' + link.replace(/^\/+/, '');
    if (type === 'whatsapp') return 'https://' + link.replace(/^\/+/, '');
    return link;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadContacts = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        loadContacts();

        // Устанавливаем интервал для периодического обновления данных
        const interval = setInterval(loadContacts, 5000); // Обновляем каждые 5 секунд

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, []);

    if (loading && !contacts) {
        return (
            <div className="contacts-page">
                <div className="status-message info">
                    Загрузка контактных данных...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="contacts-page">
                <div className="status-message error">
                    {error}
                    <button onClick={loadContacts} className="retry-button">Попробовать снова</button>
                </div>
            </div>
        );
    }

    return (
        <div className="contacts-page">
            <div className="contacts-container">
                <h1>Контакты</h1>
                
                <div className="contact-info">
                    <div className="info-section">
                        <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <div>
                                <h3>Адрес</h3>
                                <p>{contacts?.address || 'Не указан'}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-phone"></i>
                            <div>
                                <h3>Телефон</h3>
                                <pre style={{whiteSpace: 'pre-line', margin: 0}}>{contacts?.phone || 'Не указан'}</pre>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <div>
                                <h3>Email</h3>
                                <p>{contacts?.email || 'Не указан'}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-clock"></i>
                            <div>
                                <h3>Режим работы</h3>
                                <pre style={{whiteSpace: 'pre-line', margin: 0}}>{contacts?.worktime || 'Не указан'}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="social-links">
                        <h3>Мы в социальных сетях</h3>
                        <div className="social-icons">
                            {contacts?.vk && (
                                <a href={formatSocialLink(contacts.vk, 'vk')} className="social-icon" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-vk"></i>
                                </a>
                            )}
                            {contacts?.telegram && (
                                <a href={formatSocialLink(contacts.telegram, 'telegram')} className="social-icon" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-telegram"></i>
                                </a>
                            )}
                            {contacts?.whatsapp && (
                                <a href={formatSocialLink(contacts.whatsapp, 'whatsapp')} className="social-icon" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="map-container">
                    
                </div>
            </div>
        </div>
    );
} 