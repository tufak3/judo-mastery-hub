import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/MediaManagement.css';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

const MediaManagement = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [showAddPhoto, setShowAddPhoto] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        if (selectedAlbum) fetchPhotos(selectedAlbum);
    }, [selectedAlbum]);

    const fetchAlbums = async () => {
        setError(null);
        try {
            const response = await axios.get(`${SERVER_URL}/albums`);
            setAlbums(response.data);
        } catch (err) {
            console.error('Error fetching albums:', err);
            setError('Ошибка при загрузке альбомов');
        }
    };

    const fetchPhotos = async (albumId) => {
        setError(null);
        try {
            const response = await axios.get(`${SERVER_URL}/photos/${albumId}`);
            setPhotos(response.data);
        } catch (err) {
            console.error('Error fetching photos:', err);
            setError('Ошибка при загрузке фотографий');
            setPhotos([]);
        }
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${SERVER_URL}/albums`, newAlbum);
            setNewAlbum({ title: '', description: '' });
            setShowCreateAlbum(false);
            await fetchAlbums();
        } catch (err) {
            console.error('Error creating album:', err);
            setError('Ошибка при создании альбома');
        }
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setSelectedFiles([file]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPhoto = async (e) => {
        e.preventDefault();
        if (!selectedAlbum || !previewImage) {
            setError('Выберите альбом и изображение');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${SERVER_URL}/photos`, {
                album_id: selectedAlbum,
                image: previewImage,
                title: '',
                description: ''
            });

            if (response.data && response.data.id) {
                setSelectedFiles([]);
                setPreviewImage('');
                setShowAddPhoto(false);
                await fetchPhotos(selectedAlbum);
            } else {
                throw new Error('Неверный ответ от сервера');
            }
        } catch (err) {
            console.error('Error uploading photo:', err);
            setError(err.response?.data?.error || 'Ошибка при загрузке фотографии');
            // Не закрываем модальное окно при ошибке
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        if (!window.confirm('Удалить альбом и все его фото?')) return;
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${SERVER_URL}/albums/${albumId}`);
            setSelectedAlbum(null);
            await fetchAlbums();
        } catch (err) {
            console.error('Error deleting album:', err);
            setError('Ошибка при удалении альбома');
        }
        setLoading(false);
    };

    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm('Удалить фотографию?')) return;
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${SERVER_URL}/photos/${photoId}`);
            await fetchPhotos(selectedAlbum);
        } catch (err) {
            console.error('Error deleting photo:', err);
            setError('Ошибка при удалении фотографии');
        }
        setLoading(false);
    };

    return (
        <div className="media-management">
            <h2>Управление медиа</h2>
            <div className="media-buttons">
                <button className="admin-button" onClick={() => setShowCreateAlbum(true)} disabled={loading}>
                    Создать альбом
                </button>
                <button className="admin-button" onClick={() => setShowAddPhoto(true)} disabled={loading}>
                    Добавить фото
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Список альбомов */}
            {!selectedAlbum && (
                <div className="admin-album-list">
                    {albums.map(album => (
                        <div key={album.id} className="admin-album-card">
                            <div className="admin-album-title">{album.title}</div>
                            <div className="admin-album-actions">
                                <button onClick={() => setSelectedAlbum(album.id)} disabled={loading}>
                                    Просмотр
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteAlbum(album.id)}
                                    disabled={loading}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Просмотр фото в альбоме */}
            {selectedAlbum && (
                <div className="admin-album-photos-view">
                    <button 
                        className="back-to-albums" 
                        onClick={() => setSelectedAlbum(null)}
                        disabled={loading}
                    >
                        &larr; К альбомам
                    </button>
                    <h3>{albums.find(a => a.id === selectedAlbum)?.title}</h3>
                    <div className="admin-photo-grid">
                        {photos.map(photo => (
                            <div key={photo.id} className="admin-photo-item">
                                <img src={photo.image} alt={photo.title || 'Фотография'} />
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    disabled={loading}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        {photos.length === 0 && <div className="no-photos">В этом альбоме пока нет фотографий</div>}
                    </div>
                </div>
            )}

            {/* Модалки создания альбома и загрузки фото */}
            {showCreateAlbum && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Создать новый альбом</h3>
                        <form onSubmit={handleCreateAlbum}>
                            <input
                                type="text"
                                placeholder="Название альбома"
                                value={newAlbum.title}
                                onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                                required
                                disabled={loading}
                            />
                            <textarea
                                placeholder="Описание альбома"
                                value={newAlbum.description}
                                onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})}
                                disabled={loading}
                            />
                            <div className="modal-buttons">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Создание...' : 'Создать'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowCreateAlbum(false)}
                                    disabled={loading}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddPhoto && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Добавить фотографию</h3>
                        <form onSubmit={handleUploadPhoto}>
                            <select
                                value={selectedAlbum || ''}
                                onChange={(e) => setSelectedAlbum(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">Выберите альбом</option>
                                {albums.map(album => (
                                    <option key={album.id} value={album.id}>
                                        {album.title}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                required
                                disabled={loading}
                            />
                            {previewImage && (
                                <div className="image-preview">
                                    <img src={previewImage} alt="Preview" />
                                </div>
                            )}
                            <div className="modal-buttons">
                                <button 
                                    type="submit" 
                                    disabled={loading || !selectedAlbum || !previewImage}
                                >
                                    {loading ? 'Загрузка...' : 'Загрузить'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowAddPhoto(false);
                                        setPreviewImage('');
                                        setSelectedFiles([]);
                                    }}
                                    disabled={loading}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManagement; 