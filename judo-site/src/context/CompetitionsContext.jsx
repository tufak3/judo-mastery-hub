import React, { createContext, useContext, useState, useEffect } from 'react';
import competitionsService from '../services/competitionsService';

const CompetitionsContext = createContext(null);

export const CompetitionsProvider = ({ children }) => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateCompetitionStatuses = async (comps) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedCompetitions = comps.map(async (comp) => {
      const competitionDate = new Date(comp.date);
      competitionDate.setHours(0, 0, 0, 0);

      if (competitionDate < today && comp.status !== 'completed') {
        // Если дата соревнования прошла и статус не completed
        try {
          const updated = await competitionsService.updateCompetition(comp.id, {
            ...comp,
            status: 'completed'
          });
          return updated || comp;
        } catch (err) {
          console.error('Error updating competition status:', err);
          return comp;
        }
      }
      return comp;
    });

    return Promise.all(updatedCompetitions);
  };

  const loadCompetitions = async () => {
    try {
      const data = await competitionsService.getAllCompetitions();
      // Обновляем статусы и сохраняем обновленные данные
      const updatedData = await updateCompetitionStatuses(data);
      setCompetitions(updatedData);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке соревнований');
      console.error('Error loading competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Проверяем статусы каждый день в полночь
  useEffect(() => {
    const checkStatusesAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // следующий день
        0, 0, 0 // полночь
      );
      const msToMidnight = night.getTime() - now.getTime();

      // Устанавливаем таймер на полночь
      const timer = setTimeout(() => {
        loadCompetitions();
        // Рекурсивно устанавливаем следующий таймер
        checkStatusesAtMidnight();
      }, msToMidnight);

      return () => clearTimeout(timer);
    };

    // Запускаем первую проверку
    checkStatusesAtMidnight();
  }, []);

  // Начальная загрузка данных
  useEffect(() => {
    loadCompetitions();
  }, []);

  const addCompetition = async (competition) => {
    try {
      const newCompetition = await competitionsService.addCompetition(competition);
      if (newCompetition) {
        setCompetitions(prev => [...prev, newCompetition]);
        return { success: true };
      }
      return { success: false, error: 'Ошибка при добавлении соревнования' };
    } catch (err) {
      console.error('Error adding competition:', err);
      return { success: false, error: 'Ошибка при добавлении соревнования' };
    }
  };

  const updateCompetition = async (id, updatedCompetition) => {
    try {
      const updated = await competitionsService.updateCompetition(id, updatedCompetition);
      if (updated) {
        setCompetitions(prev => prev.map(comp => 
          comp.id === id ? { ...comp, ...updated } : comp
        ));
        return { success: true };
      }
      return { success: false, error: 'Ошибка при обновлении соревнования' };
    } catch (err) {
      console.error('Error updating competition:', err);
      return { success: false, error: 'Ошибка при обновлении соревнования' };
    }
  };

  const deleteCompetition = async (id) => {
    try {
      const success = await competitionsService.deleteCompetition(id);
      if (success) {
        setCompetitions(prev => prev.filter(comp => comp.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Ошибка при удалении соревнования' };
    } catch (err) {
      console.error('Error deleting competition:', err);
      return { success: false, error: 'Ошибка при удалении соревнования' };
    }
  };

  const getActiveCompetitions = () => {
    return competitions.filter(comp => 
      comp.status === 'upcoming' || comp.status === 'registration'
    );
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <CompetitionsContext.Provider value={{
      competitions,
      loading,
      error,
      addCompetition,
      updateCompetition,
      deleteCompetition,
      getActiveCompetitions,
      refreshCompetitions: loadCompetitions
    }}>
      {children}
    </CompetitionsContext.Provider>
  );
};

export const useCompetitions = () => {
  const context = useContext(CompetitionsContext);
  if (!context) {
    throw new Error('useCompetitions must be used within a CompetitionsProvider');
  }
  return context;
}; 