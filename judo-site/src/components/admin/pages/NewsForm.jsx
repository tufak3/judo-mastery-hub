import React, { useState } from 'react';
import { processImageBeforeUpload, checkFileSize, checkFileType, truncateText } from '../../../utils/imageUtils';
import './NewsForm.css';

const NewsForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    status: 'draft'
  });

  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Проверяем размер и тип файла
      checkFileSize(file);
      checkFileType(file);

      // Обрабатываем изображение
      const processedImage = await processImageBeforeUpload(file);
      setImagePreview(processedImage);
      setFormData(prev => ({ ...prev, image: processedImage }));
      setError('');
    } catch (err) {
      setError(err.message);
      e.target.value = ''; // Очищаем input
    }
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;

    // Обрезаем текст перед отправкой
    const truncatedContent = truncateText(formData.content);
    onSubmit({
      ...formData,
      content: truncatedContent
    });
  };

  return (
    <div className="news-form-container">
      <form onSubmit={handleSubmit} className="news-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Описание</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleContentChange}
            required
            rows="6"
            placeholder="Введите текст новости..."
          />
          <div className="character-count">
            {formData.content.length}/1000 символов
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Дата публикации</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Изображение</label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовать</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={!!error}>
            {initialData ? 'Сохранить' : 'Добавить'}
          </button>
          <button type="button" className="secondary-button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm; 