import React, { useState, useEffect } from 'react';
import { usePartners } from '../../../context/PartnersContext';
import styles from '@styles/admin/PartnersAdmin.module.css';

const PartnersAdmin = () => {
  const { partners, fetchPartners, addPartner, updatePartner, deletePartner } = usePartners();
  const [selectedFile, setSelectedFile] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const partnerData = {
        name: partnerName,
        image: previewImage
      };

      if (editingPartnerId) {
        await updatePartner(editingPartnerId, partnerData);
      } else {
        await addPartner(partnerData);
      }

      setPartnerName('');
      setSelectedFile(null);
      setPreviewImage('');
      setEditingPartnerId(null);
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setEditingPartnerId(partner.id);
    setPartnerName(partner.name);
    setPreviewImage(partner.image);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого партнера?')) {
      try {
        await deletePartner(id);
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  return (
    <div className={styles.partnersAdmin}>
      <h2 className={styles.title}>Управление партнерами</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="partnerName">Название партнера:</label>
          <input
            type="text"
            id="partnerName"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="partnerImage">Логотип партнера:</label>
          <input
            type="file"
            id="partnerImage"
            onChange={handleFileChange}
            accept="image/*"
            required={!editingPartnerId || !previewImage}
          />
          {previewImage && (
            <div className={styles.imagePreview}>
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Сохранение...' : editingPartnerId ? 'Обновить' : 'Добавить'}
        </button>

        {editingPartnerId && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              setEditingPartnerId(null);
              setPartnerName('');
              setSelectedFile(null);
              setPreviewImage('');
            }}
          >
            Отмена
          </button>
        )}
      </form>

      <div className={styles.partnersList}>
        {partners.map((partner) => (
          <div key={partner.id} className={styles.partnerItem}>
            <img src={partner.image} alt={partner.name} className={styles.partnerImage} />
            <div className={styles.partnerInfo}>
              <h3>{partner.name}</h3>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(partner)} className={styles.editButton}>
                  Редактировать
                </button>
                <button onClick={() => handleDelete(partner.id)} className={styles.deleteButton}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersAdmin; 