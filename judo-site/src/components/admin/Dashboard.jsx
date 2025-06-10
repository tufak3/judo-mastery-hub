import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Панель управления</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Новости</h3>
          <p className="stat-number">0</p>
          <p className="stat-label">Всего публикаций</p>
        </div>
        
        <div className="stat-card">
          <h3>Соревнования</h3>
          <p className="stat-number">0</p>
          <p className="stat-label">Активных событий</p>
        </div>
        
        <div className="stat-card">
          <h3>Календарь</h3>
          <p className="stat-number">0</p>
          <p className="stat-label">Предстоящих событий</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="action-buttons">
          <button className="action-btn">Добавить новость</button>
          <button className="action-btn">Добавить событие</button>
          <button className="action-btn">Обновить календарь</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 