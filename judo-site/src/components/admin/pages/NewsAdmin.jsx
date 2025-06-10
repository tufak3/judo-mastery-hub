import React, { useState } from 'react';
import { useNews } from '../../../context/NewsContext';
import NewsForm from './NewsForm';
import './AdminPages.css';

const NewsAdmin = () => {
  const { news, addNews, updateNews, deleteNews } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      deleteNews(id);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleSubmit = (formData) => {
    if (editingNews) {
      updateNews(editingNews.id, formData);
    } else {
      addNews(formData);
    }
    setShowForm(false);
    setEditingNews(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Управление новостями</h1>
        <button className="primary-button" onClick={() => setShowForm(true)}>
          Добавить новость
        </button>
      </div>

      <div className="admin-content-section">
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Поиск по заголовку..."
            className="admin-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="published">Опубликованные</option>
            <option value="draft">Черновики</option>
          </select>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-button edit"
                        onClick={() => handleEdit(item)}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="icon-button delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <NewsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingNews}
        />
      )}
    </div>
  );
};

export default NewsAdmin; 