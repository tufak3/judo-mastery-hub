import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import '../styles/mainpagecomp.css';
import teamImage from '../assets/9_9.jpeg';
import logo from '../assets/logo_fdnr.webp';

const MainPageComp = () => {
    const { news } = useNews();
    const navigate = useNavigate();

    // Обрабатываем новости сразу при получении
    const latestNews = news
        .filter(item => item.status === 'published')
        .map(item => ({
            ...item,
            title: item.title && item.title.length > 50 
                ? item.title.substring(0, 50) + '...' 
                : item.title,
            content: item.content && item.content.length > 200 
                ? item.content.substring(0, 200) + '...' 
                : item.content
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const handleNewsClick = (newsId) => {
        navigate(`/news/${newsId}`);
    };

    return (
        <div className="main-page">
            <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${teamImage})` }}>
                <div className="hero-content">
                    <h1>Донецкая Городская Федерация Дзюдо и Самбо</h1>
                    <p>Развиваем дзюдо, воспитываем чемпионов</p>
                </div>
            </section>

            <section className="news-section">
                <div className="container">
                    <h2>Последние новости</h2>
                    <div className="news-grid">
                        {latestNews.map((newsItem) => (
                            <div 
                                key={newsItem.id} 
                                className="news-card"
                                onClick={() => handleNewsClick(newsItem.id)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleNewsClick(newsItem.id);
                                    }
                                }}
                            >
                                {newsItem.image && (
                                    <div className="news-image">
                                        <img src={newsItem.image} alt={newsItem.title} />
                                    </div>
                                )}
                                <div className="news-content">
                                    <h3 className="news-title">{newsItem.title}</h3>
                                    <p className="news-text">{newsItem.content}</p>
                                    <span className="news-date">{new Date(newsItem.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/news" className="view-all-news">
                        Смотреть все новости
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default MainPageComp;

