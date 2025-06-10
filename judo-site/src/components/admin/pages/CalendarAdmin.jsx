import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPages.css';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

const CalendarAdmin = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [type, setType] = useState('competition');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/calendar-events`);
      setEvents(res.data);
    } catch (err) {
      setError('Ошибка при загрузке событий');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!date || !type) return;
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/calendar-events`, { date, type });
      setDate('');
      setType('competition');
      fetchEvents();
    } catch (err) {
      setError('Ошибка при добавлении события');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить это событие?')) return;
    setLoading(true);
    try {
      await axios.delete(`${SERVER_URL}/calendar-events/${id}`);
      fetchEvents();
    } catch (err) {
      setError('Ошибка при удалении события');
    }
    setLoading(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Управление календарем</h1>
      </div>
      <div className="admin-content-section">
        <form className="calendar-form" onSubmit={handleAddEvent}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <select value={type} onChange={e => setType(e.target.value)} required>
            <option value="competition">Соревнование</option>
            <option value="festival">Фестиваль</option>
          </select>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Добавление...' : 'Подтвердить'}
          </button>
        </form>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.date}</td>
                  <td>
                    <span className={`type-badge ${event.type}`}>
                      {event.type === 'competition' ? 'Соревнование' : 'Фестиваль'}
                    </span>
                  </td>
                  <td>
                    <button className="icon-button delete" onClick={() => handleDelete(event.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={3}>Нет событий</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default CalendarAdmin; 