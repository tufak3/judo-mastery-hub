import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/calendarPage.css'

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState([])

    useEffect(() => {
        fetchEvents();
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/calendar-events`)
            setEvents(res.data)
        } catch (err) {
            // Можно добавить обработку ошибки
        }
    }

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ]

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const firstDayOfMonth = (date) => {
        let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        return day === 0 ? 6 : day - 1 // Пн=0, Вс=6
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const getEventsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(event => event.date === dateStr)
    }

    const renderCalendar = () => {
        const days = daysInMonth(currentDate)
        const firstDay = firstDayOfMonth(currentDate)
        const calendar = []
        let week = []

        for (let i = 0; i < firstDay; i++) {
            week.push(<td key={`empty-${i}`} className="calendar-day empty"></td>)
        }

        for (let day = 1; day <= days; day++) {
            const eventsForDay = getEventsForDate(day)
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() &&
                           new Date().getFullYear() === currentDate.getFullYear()

            week.push(
                <td key={day} className={`calendar-day ${isToday ? 'today' : ''} ${eventsForDay.length > 0 ? 'has-event' : ''}`}>
                    <div className="day-content">
                        <span className="day-number">{day}</span>
                        <div className="event-markers">
                            {eventsForDay.map(ev => (
                                <span key={ev.id} className={`event-dot ${ev.type}`}></span>
                            ))}
                        </div>
                    </div>
                </td>
            )

            if ((firstDay + day) % 7 === 0 || day === days) {
                calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>)
                week = []
            }
        }

        return calendar
    }

    return (
        <div className="calendar-page">
            <div className="calendar-container">
                <div className="calendar-header">
                    <h1>Календарь событий</h1>
                    <div className="calendar-controls">
                        <button onClick={prevMonth} className="month-nav">&lt;</button>
                        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button onClick={nextMonth} className="month-nav">&gt;</button>
                    </div>
                </div>

                <div className="calendar-grid">
                    <table>
                        <thead>
                            <tr>
                                <th>Пн</th>
                                <th>Вт</th>
                                <th>Ср</th>
                                <th>Чт</th>
                                <th>Пт</th>
                                <th>Сб</th>
                                <th>Вс</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCalendar()}
                        </tbody>
                    </table>
                </div>

                <div className="event-categories">
                    <div className="category">
                        <span className="category-marker competition"></span>
                        <span>Соревнования</span>
                    </div>
                    <div className="category">
                        <span className="category-marker festival"></span>
                        <span>Фестивали</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 