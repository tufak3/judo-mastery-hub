import React from 'react';
import '../../styles/oath.css';

const OathPage = () => {
    const oathPoints = [
        {
            id: 1,
            text: "Раз я решил посвятить себя дзюдо, то не откажусь от занятий."
        },
        {
            id: 2,
            text: "Своим поведением я обещаю никогда не уронить достоинство Школы."
        },
        {
            id: 3,
            text: "Я никогда не выдам секретов Школы недостойным, и лишь в крайнем случае буду брать уроки в другом месте."
        },
        {
            id: 4,
            text: "Обещаю не давать уроки без разрешения моего Учителя."
        },
        {
            id: 5,
            text: "Клянусь в течение всей своей жизни уважать правила Кодокана, сейчас как ученик, а позже как преподаватель, если я им когда-либо буду."
        }
    ];

    return (
        <div className="oath-page">
            <div className="oath-container">
                <h1 className="oath-title">Клятва Дзюдоиста</h1>
                
                <div className="oath-intro">
                    <div className="founder-image-container">
                        <img src="/images/judo/jigoro-kano.jpg" alt="Дзигоро Кано" className="founder-image" />
                    </div>
                    <p className="intro-text">
                        Своим происхождением дзюдо обязано многовековой традиции боевого единоборства, сформировавшемуся и развивавшемуся в различных школах дзю-дзюцу средневековой. Родоначальником современного дзюдо считается Дзигоро Кано (1860-1938), создавший многогранную систему физического воспитания и сочетавший в себе идеи и традиции олимпийского спорта и самурайского движения.
                    </p>
                </div>

                <div className="oath-content">
                    <h2 className="oath-subtitle">Дзигоро Кано определил 5 пунктов клятвы посвященного в дзюдо:</h2>
                    <div className="oath-points">
                        {oathPoints.map((point) => (
                            <div key={point.id} className="oath-point">
                                <div className="point-number">{point.id}</div>
                                <p className="point-text">{point.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="oath-footer">
                    <blockquote className="quote">
                        «Максимальный результат — фундамент, на котором стоит все здание дзюдо. Более того, этот принцип полностью может быть использован и в системе физического воспитания. Его можно также использовать для развития умственных способностей во время занятий, а также при воспитании и формировании характера. Можно добиться, что этот принцип будет иметь влияние на манеры человека, на то, как он одевается, живет, на его поведение в обществе и отношение к окружающим. Словом, этот принцип может стать искусством жизни».
                    </blockquote>
                </div>
            </div>
        </div>
    );
};

export default OathPage; 