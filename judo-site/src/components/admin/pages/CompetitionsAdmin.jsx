import React, { useState } from 'react';
import { useCompetitions } from '../../../context/CompetitionsContext';
import './AdminPages.css';

const CompetitionsAdmin = () => {
  const { competitions, addCompetition, updateCompetition, deleteCompetition, loading, error: contextError } = useCompetitions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    requirements: '',
    registrationDeadline: '',
    status: 'upcoming',
    image: ''
  });
  const [operationStatus, setOperationStatus] = useState({ message: '', type: '' });

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      requirements: '',
      registrationDeadline: '',
      status: 'upcoming',
      image: ''
    });
    setEditingCompetition(null);
    setShowForm(false);
    setOperationStatus({ message: '', type: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationStatus({ message: 'Сохранение...', type: 'info' });

    try {
      // Проверяем дату соревнования
      const competitionDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      competitionDate.setHours(0, 0, 0, 0);

      // Если дата соревнования уже прошла, устанавливаем статус "completed"
      const updatedFormData = {
        ...formData,
        status: competitionDate < today ? 'completed' : formData.status
      };

      const result = editingCompetition
        ? await updateCompetition(editingCompetition.id, updatedFormData)
        : await addCompetition(updatedFormData);

      if (result.success) {
        setOperationStatus({
          message: `Соревнование успешно ${editingCompetition ? 'обновлено' : 'добавлено'}`,
          type: 'success'
        });
        resetForm();
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

  const handleEdit = (competition) => {
    setEditingCompetition(competition);
    setFormData({
      title: competition.title,
      date: competition.date,
      location: competition.location,
      description: competition.description || '',
      requirements: competition.requirements || '',
      registrationDeadline: competition.registrationDeadline || '',
      status: competition.status,
      image: competition.image || ''
    });
    setShowForm(true);
    setOperationStatus({ message: '', type: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это соревнование?')) {
      setOperationStatus({ message: 'Удаление...', type: 'info' });
      
      try {
        const result = await deleteCompetition(id);
        if (result.success) {
          setOperationStatus({
            message: 'Соревнование успешно удалено',
            type: 'success'
          });
        } else {
          setOperationStatus({
            message: result.error || 'Произошла ошибка при удалении',
            type: 'error'
          });
        }
      } catch (err) {
        setOperationStatus({
          message: 'Произошла ошибка при удалении',
          type: 'error'
        });
      }
    }
  };

  const filteredCompetitions = competitions.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="admin-page">Загрузка...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Управление соревнованиями</h1>
        <button 
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отменить' : 'Добавить соревнование'}
        </button>
      </div>

      {loading && <div className="status-message info">Загрузка данных...</div>}
      
      {contextError && (
        <div className="status-message error">
          Ошибка: {contextError}
        </div>
      )}
      
      {operationStatus && (
        <div className={`status-message ${operationStatus.type}`}>
          {operationStatus.message}
        </div>
      )}

      {showForm && (
        <div className="admin-form-section">
          <h2>{editingCompetition ? 'Редактировать соревнование' : 'Добавить новое соревнование'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Название</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Дата проведения</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Место проведения</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Требования</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationDeadline">Дедлайн регистрации</label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Статус</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="upcoming">Предстоящие</option>
                <option value="registration">Регистрация</option>
                <option value="completed">Завершено</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">URL изображения</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingCompetition ? 'Сохранить изменения' : 'Добавить соревнование'}
              </button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                Отменить
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-content-section">
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Поиск по названию..."
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
            <option value="upcoming">Предстоящие</option>
            <option value="registration">Регистрация</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Дата</th>
                <th>Место проведения</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.date).toLocaleDateString('ru-RU')}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'upcoming' ? 'Предстоящие' : 
                       item.status === 'registration' ? 'Регистрация' : 'Завершено'}
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
    </div>
  );
};

export default CompetitionsAdmin; 