import React from 'react';
import { Link } from 'react-router-dom';
import { useContacts } from '../context/ContactsContext';
import '../styles/footer.css';

const formatSocialLink = (link, type) => {
    if (!link) return '';
    if (/^https?:\/\//i.test(link)) return link;
    if (type === 'vk') return `https://${link.replace(/^\/+/, '')}`;
    if (type === 'telegram') return `https://${link.replace(/^\/+/, '')}`;
    if (type === 'whatsapp') return `https://${link.replace(/^\/+/, '')}`;
    return link;
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { contacts } = useContacts();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Донецкая Городская Федерация Дзюдо и Самбо</h3>
                    {contacts?.address && <p>{contacts.address}</p>}
                    {contacts?.email && <p>Email: {contacts.email}</p>}
                </div>
                
                <div className="footer-section">    
                    <h3>Навигация</h3>
                    <ul>
                        <li><Link to="/federation">О федерации</Link></li>
                        <li><Link to="/news">Новости</Link></li>
                        <li><Link to="/competitions">Соревнования</Link></li>
                        <li><Link to="/calendar">Календарь</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Социальные сети</h3>
                    <div className="social-links">
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
            
            <div className="footer-bottom">
                <p>&copy; {currentYear} Федерация дзюдо ДНР. Все права защищены.</p>
            </div>
        </footer>
    );
} 