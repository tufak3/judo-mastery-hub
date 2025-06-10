import React, { createContext, useContext, useState, useEffect } from 'react';
import newsService from '../services/newsService';

const NewsContext = createContext(null);

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка существующих новостей при монтировании компонента
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const allNews = await newsService.getAllNews();
      setNews(allNews);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке новостей');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (newsItem) => {
    try {
      setLoading(true);
      const newNews = await newsService.addNews(newsItem);
      if (newNews) {
        setNews(prevNews => [...prevNews, newNews]);
      }
      return newNews;
    } catch (err) {
      setError('Ошибка при добавлении новости');
      console.error('Error adding news:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (id, updatedNews) => {
    try {
      setLoading(true);
      const updated = await newsService.updateNews(id, updatedNews);
      if (updated) {
        setNews(prevNews => prevNews.map(news => 
          news.id === id ? updated : news
        ));
      }
      return updated;
    } catch (err) {
      setError('Ошибка при обновлении новости');
      console.error('Error updating news:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id) => {
    try {
      setLoading(true);
      const success = await newsService.deleteNews(id);
      if (success) {
        setNews(prevNews => prevNews.filter(news => news.id !== id));
      }
      return success;
    } catch (err) {
      setError('Ошибка при удалении новости');
      console.error('Error deleting news:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPublishedNews = async () => {
    try {
      const publishedNews = await newsService.getPublishedNews();
      return publishedNews;
    } catch (err) {
      console.error('Error getting published news:', err);
      return [];
    }
  };

  return (
    <NewsContext.Provider value={{ 
      news, 
      loading,
      error,
      addNews, 
      updateNews, 
      deleteNews,
      getPublishedNews,
      refreshNews: loadNews
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}; 