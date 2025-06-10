/*
import React from 'react';
import '../styles/learningPage.css';
import '../styles/statusMessages.css';

function parseSchedule(schedule) {
    if (!schedule) return [];
    if (Array.isArray(schedule)) return schedule;
    return schedule.split(';').map(s => s.trim()).filter(Boolean);
}

// Статическое расписание (пример)
const courses = [
    {
        id: 1,
        title: 'Группа для начинающих',
        level: 'Начальный',
        instructor: 'Иван Иванов',
        schedule: 'Пн, Ср, Пт: 18:00-19:30; Сб: 12:00-13:30',
        price: '1500 руб/мес',
        maxParticipants: 20,
        currentParticipants: 5,
        description: 'Группа для тех, кто только начинает заниматься дзюдо. Обучение с нуля, базовые техники, развитие физической формы.',
        image: ''
    },
    {
        id: 2,
        title: 'Группа продвинутых',
        level: 'Продвинутый',
        instructor: 'Алексей Петров',
        schedule: 'Вт, Чт: 19:00-20:30; Сб: 14:00-15:30',
        price: '1800 руб/мес',
        maxParticipants: 15,
        currentParticipants: 12,
        description: 'Для тех, кто уже освоил базовые техники и хочет совершенствовать навыки, участвовать в соревнованиях.',
        image: ''
    }
    // Добавьте свои группы по аналогии
];

export default function LearningPage() {
    return (
        <div className="learning-page">
            <div className="learning-container">
                <h1>Расписание обучения</h1>
                <div className="schedule-cards">
                    {courses.length === 0 ? (
                        <div className="status-message info">
                            Нет доступных групп для записи
                        </div>
                    ) : (
                        courses.map((course) => (
                            <div key={course.id} className="schedule-card">
                                {course.image && (
                                    <div className="course-image-top">
                                        <img src={course.image} alt={course.title} />
                                    </div>
                                )}
                                <div className="card-header">
                                    <h2>{course.title}</h2>
                                    <span className="level-badge">{course.level}</span>
                                </div>
                                <div className="card-content">
                                    <div className="info-row">
                                        <i className="fas fa-user"></i>
                                        <span>{course.instructor}</span>
                                    </div>
                                    <div className="info-row">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>
                                            <ul className="schedule-list">
                                                {parseSchedule(course.schedule).map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </span>
                                    </div>
                                    <div className="description">
                                        <p>{course.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="additional-info">
                    <h2>Дополнительная информация</h2>
                    <div className="info-cards">
                        <div className="info-card">
                            <h3>Что взять с собой</h3>
                            <ul>
                                <li>Кимоно для дзюдо (для начинающих возможна обычная спортивная форма)</li>
                                <li>Сменная обувь</li>
                                <li>Полотенце</li>
                                <li>Бутылка воды</li>
                            </ul>
                        </div>
                        <div className="info-card">
                            <h3>Правила посещения</h3>
                            <ul>
                                <li>Приходить за 10-15 минут до начала тренировки</li>
                                <li>Соблюдать правила гигиены</li>
                                <li>Уважительно относиться к тренеру и другим ученикам</li>
                                <li>Предупреждать об отсутствии заранее</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
*/

// Временно закомментированная страница
export default function LearningPage() {
    return null;
} 