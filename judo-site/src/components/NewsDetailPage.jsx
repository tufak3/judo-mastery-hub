import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import '../styles/NewsDetailPage.css';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPublishedNews } = useNews();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        setLoading(true);
        const news = await getPublishedNews();
        const item = news.find(n => n.id === parseInt(id));
        if (item) {
          setNewsItem(item);
        } else {
          setError('Новость не найдена');
        }
      } catch (err) {
        setError('Ошибка при загрузке новости');
        console.error('Error loading news item:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [id, getPublishedNews]);

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-detail-page">
        <div className="error-message">
          <h2>Упс! Что-то пошло не так</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/news')}>Вернуться к списку новостей</button>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="news-detail-page">
        <div className="error-message">
          <h2>Новость не найдена</h2>
          <p>К сожалению, запрашиваемая новость не существует или была удалена.</p>
          <button onClick={() => navigate('/news')}>Вернуться к списку новостей</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="news-detail-container">
        <button className="back-button" onClick={() => navigate('/news')}>
          Назад к новостям
        </button>
        
        <article className="news-detail">
          <div className="news-detail-header">
            <p className="news-detail-title">{newsItem.title}</p>
            <span className="news-detail-date">
              {new Date(newsItem.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          {newsItem.image && (
            <div className="news-detail-image-container">
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="news-detail-image"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="news-detail-content">
            {newsItem.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage; 