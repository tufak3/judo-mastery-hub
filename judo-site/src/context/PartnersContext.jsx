import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const PartnersContext = createContext();

export const usePartners = () => useContext(PartnersContext);

export const PartnersProvider = ({ children }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/partners`);
      setPartners(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async (partnerData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/partners`, partnerData);
      setPartners([...partners, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePartner = async (id, partnerData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/partners/${id}`, partnerData);
      setPartners(partners.map(partner => partner.id === id ? response.data : partner));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePartner = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/partners/${id}`);
      setPartners(partners.filter(partner => partner.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    partners,
    loading,
    error,
    fetchPartners,
    addPartner,
    updatePartner,
    deletePartner
  };

  return (
    <PartnersContext.Provider value={value}>
      {children}
    </PartnersContext.Provider>
  );
}; 