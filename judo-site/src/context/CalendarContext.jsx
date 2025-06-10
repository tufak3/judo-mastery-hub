import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Тренировочный сбор',
      startDate: '2024-04-01',
      endDate: '2024-04-07',
      type: 'training',
      location: 'Спортивная база "Юность"',
      description: 'Весенний тренировочный сбор',
      coach: 'Иванов И.И.'
    }
  ]);

  const addEvent = (event) => {
    setEvents(prev => [...prev, { ...event, id: prev.length + 1 }]);
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsByMonth = (year, month) => {
    return events.filter(event => {
      const startDate = new Date(event.startDate);
      return startDate.getFullYear() === year && startDate.getMonth() === month;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events.filter(event => new Date(event.startDate) >= today);
  };

  return (
    <CalendarContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsByMonth,
      getUpcomingEvents
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}; 