import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@styles/Partners.module.css';

const Partners = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/partners`);
        setPartners(response.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className={styles.partnersContainer}>
      <h1 className={styles.title}>Наши партнеры</h1>
      <div className={styles.partnersGrid}>
        {partners.map((partner) => (
          <div key={partner.id} className={styles.partnerCard}>
            <div className={styles.imageContainer}>
              <img 
                src={partner.image} 
                alt={partner.name} 
                className={styles.partnerImage}
              />
            </div>
            <h3 className={styles.partnerName}>{partner.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners; 