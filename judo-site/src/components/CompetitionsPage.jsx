import React, { useState, useEffect } from 'react'
import competitionsService from '../services/competitionsService'
import '../styles/competitionsPage.css'
import '../styles/statusMessages.css'

export default function CompetitionsPage() {
    const [activeTab, setActiveTab] = useState('upcoming')
    const [competitions, setCompetitions] = useState({ upcoming: [], past: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadCompetitions()
    }, [])

    const loadCompetitions = async () => {
        try {
            setLoading(true)
            const allCompetitions = await competitionsService.getAllCompetitions()
            
            // Разделяем соревнования на предстоящие и прошедшие
            const currentDate = new Date()
            const upcoming = allCompetitions.filter(comp => new Date(comp.date) >= currentDate)
            const past = allCompetitions.filter(comp => new Date(comp.date) < currentDate)

            setCompetitions({
                upcoming: upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)),
                past: past.sort((a, b) => new Date(b.date) - new Date(a.date))
            })
            setError(null)
        } catch (err) {
            setError('Ошибка при загрузке соревнований')
            console.error('Error loading competitions:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="competitions-page">
                <div className="status-message info">
                    Загрузка соревнований...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="competitions-page">
                <div className="status-message error">
                    {error}
                    <button onClick={loadCompetitions} className="retry-button">Попробовать снова</button>
                </div>
            </div>
        )
    }

    return (
        <div className="competitions-page">
            <div className="competitions-container">
                <h1>Соревнования по дзюдо</h1>
                
                <div className="tabs">
                    <button 
                        className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Предстоящие соревнования
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Прошедшие соревнования
                    </button>
                </div>

                <div className="competitions-timeline">
                    {competitions[activeTab].length === 0 ? (
                        <div className="status-message info">
                            {activeTab === 'upcoming' 
                                ? 'Нет предстоящих соревнований' 
                                : 'Нет прошедших соревнований'}
                        </div>
                    ) : (
                        competitions[activeTab].map((competition) => (
                            <div key={competition.id} className="competition-card">
                                <div className="competition-header">
                                    <h2>{competition.title}</h2>
                                    <div className="competition-date">
                                        {new Date(competition.date).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className="competition-content">
                                    <div className="competition-info">
                                        <p><strong>Место проведения:</strong> {competition.location}</p>
                                        <p><strong>Описание:</strong> {competition.description}</p>
                                        {competition.requirements && (
                                            <p><strong>Требования:</strong> {competition.requirements}</p>
                                        )}
                                        
                                        {activeTab === 'upcoming' && competition.registrationDeadline && (
                                            <>
                                                <p>
                                                    <strong>Конец регистрации:</strong> {' '}
                                                    {new Date(competition.registrationDeadline).toLocaleDateString('ru-RU')}
                                                </p>
                                                <p>
                                                    <strong>Статус:</strong> {' '}
                                                    <span className="status">{competition.status}</span>
                                                </p>
                                            </>
                                        )}

                                        {competition.image && (
                                            <div className="competition-image">
                                                <img src={competition.image} alt={competition.title} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
} 