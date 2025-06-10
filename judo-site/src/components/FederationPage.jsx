import React from 'react';
import '../styles/federationPage.css';
import logo from '../assets/logo_fdnr.webp';

export default function FederationPage() {
    const objectives = [
        'развитие дзюдо на территории Донецкой Народной Республики;',
        'содействие в подготовке, организации и участию спортсменов сборных команд ДНР по дзюдо в чемпионатах и первенствах мира, Европы и других международных соревнованиях;',
        'подготовка и организация республиканских спортивных мероприятий и международных соревнований по дзюдо на территории ДНР;',
        'организация подготовки кадров для тренерской работы по дзюдо;',
        'участие в материально-техническом, медицинском, научно-методическом и/или ином обеспечении секций дзюдо, спортсменов и тренеров ДНР;',
        'участие в развитии инфраструктуры и материально-технической базы вида спорта «дзюдо».'
    ];

    return (
        <div className="federation-page">
            <div className="federation-hero">
                <h1>Донецкая Городская Федерация Дзюдо и Самбо</h1>
            </div>

            <div className="federation-content">
                <div className="container">
                    <div className="history-section">
                        <p className="foundation-text">
                            На учредительном собрании 21 февраля 2019 года создана Общественная организация «Федерация дзюдо ДНР» (далее — Федерация).
                        </p>
                    </div>

                    <div className="objectives-section">
                        <h2>Основными задачами Федерации являются:</h2>
                        <ul className="objectives-list">
                            {objectives.map((objective, index) => (
                                <li key={index} className="objective-item">
                                    {objective}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 