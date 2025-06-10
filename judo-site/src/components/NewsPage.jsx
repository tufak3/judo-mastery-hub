import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import '../styles/newsPage.css';

const ITEMS_PER_PAGE = 10;

const NewsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getPublishedNews, loading, error } = useNews();
  const [publishedNews, setPublishedNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    loadPublishedNews();
  }, [searchParams]);

  const loadPublishedNews = async () => {
    const news = await getPublishedNews();
    // Обрабатываем текст и заголовки новостей при загрузке
    const processedNews = news.map(item => ({
      ...item,
      title: item.title && item.title.length > 100 
        ? item.title.substring(0, 100) + '...' 
        : item.title,
      content: item.content && item.content.length > 1000 
        ? item.content.substring(0, 1000) + '...' 
        : item.content
    }));
    setPublishedNews(processedNews.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(publishedNews.length / ITEMS_PER_PAGE);

  // Получаем новости для текущей страницы
  const currentNews = publishedNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="news-page">
        <h1>Новости</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <h1>Новости</h1>
        <div className="error-message">
          {error}
          <button onClick={loadPublishedNews}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <h1>Новости</h1>
      <div className="news-list">
        {currentNews.length === 0 ? (
          <div className="no-news-message">
            Нет доступных новостей
          </div>
        ) : (
          <>
            {currentNews.map((newsItem) => (
              <div 
                key={newsItem.id} 
                className="news-item"
                onClick={() => handleNewsClick(newsItem.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNewsClick(newsItem.id);
                  }
                }}
              >
              <div className="news-item-inner">
                {newsItem.image && (
                  <div className="news-image-container">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title} 
                      className="news-image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="news-content">
                  <h2 className="news-title">{newsItem.title}</h2>
                  <span className="news-date">{new Date(newsItem.date).toLocaleDateString()}</span>
                  <p className="news-text">{newsItem.content}</p>
                </div>
              </div>
            </div>
            ))}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPage; 