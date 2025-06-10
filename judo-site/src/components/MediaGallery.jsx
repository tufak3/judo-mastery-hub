import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MediaGallery.css';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

const MediaGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [photosByAlbum, setPhotosByAlbum] = useState({});
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [modalPhoto, setModalPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${SERVER_URL}/albums`);
            setAlbums(response.data);
            // Для каждого альбома сразу подгружаем фото
            response.data.forEach(album => fetchPhotos(album.id));
        } catch (err) {
            console.error('Error fetching albums:', err);
            setError('Ошибка при загрузке альбомов');
        } finally {
            setLoading(false);
        }
    };

    const fetchPhotos = async (albumId) => {
        try {
            const response = await axios.get(`${SERVER_URL}/photos/${albumId}`);
            setPhotosByAlbum(prev => ({ ...prev, [albumId]: response.data }));
        } catch (err) {
            console.error(`Error fetching photos for album ${albumId}:`, err);
            setPhotosByAlbum(prev => ({ ...prev, [albumId]: [] }));
        }
    };

    // Получить последнюю фотографию альбома
    const getLastPhoto = (albumId) => {
        const photos = photosByAlbum[albumId] || [];
        if (photos.length === 0) return null;
        return photos[0]; // сортировка по дате уже есть на сервере
    };

    if (loading) {
        return <div className="media-gallery"><div className="loading-spinner"></div></div>;
    }
    if (error) {
        return <div className="media-gallery"><div className="error-message">{error}</div></div>;
    }

    return (
        <div className="media-gallery">
            <h1>Медиа галерея</h1>
            {!selectedAlbum ? (
                <div className="album-grid">
                    {albums.map(album => {
                        const lastPhoto = getLastPhoto(album.id);
                        return (
                            <div key={album.id} className="album-card" onClick={() => setSelectedAlbum(album.id)}>
                                <div className="album-cover">
                                    {lastPhoto ? (
                                        <img src={lastPhoto.image} alt={album.title} />
                                    ) : (
                                        <div className="album-placeholder">Нет фото</div>
                                    )}
                                </div>
                                <div className="album-title">{album.title}</div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="album-view">
                    <button className="back-button" onClick={() => setSelectedAlbum(null)}>&larr; Назад к альбомам</button>
                    <h2>{albums.find(a => a.id === selectedAlbum)?.title}</h2>
                    <div className="photo-grid">
                        {(photosByAlbum[selectedAlbum] || []).map(photo => (
                            <div key={photo.id} className="photo-item" onClick={() => setModalPhoto(photo)}>
                                <img src={photo.image} alt={photo.title || 'Фотография'} />
                            </div>
                        ))}
                        {photosByAlbum[selectedAlbum]?.length === 0 && (
                            <div className="no-photos">В этом альбоме пока нет фотографий</div>
                        )}
                    </div>
                </div>
            )}

            {/* Модальное окно для просмотра фото */}
            {modalPhoto && (
                <div className="photo-modal" onClick={() => setModalPhoto(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src={modalPhoto.image} alt={modalPhoto.title || 'Фотография'} />
                        <button className="close-button" onClick={() => setModalPhoto(null)}>&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaGallery; 