import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';
import logo from '../assets/logo_fdnr.webp';

export default function Header() {
    const [activeButton, setActiveButton] = useState('ФДДНР');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    const navItems = [
        { label: 'ФДДНР', link: '/federation' },
        // Временно отключено
        // { label: 'Обучение', link: '/learning' },
        { 
            label: 'Соревнования', 
            link: '/competitions',
            isDropdown: true,
            dropdownItems: [
                { label: 'Все соревнования', link: '/competitions' },
                { label: 'Календарь', link: '/calendar' }
            ]
        },
        { label: 'Новости', link: '/news' },
        { label: 'Медиа', link: '/media' },
        { 
            label: 'О дзюдо', 
            link: '/about-judo/history', 
            isDropdown: true,
            dropdownItems: [
                { label: 'История дзюдо', link: '/about-judo/history' },
                { label: 'Техника дзюдо', link: '/about-judo/techniques' },
                { label: 'Мудрые высказывания', link: '/about-judo/wisdom' },
                { label: 'Клятва дзюдоиста', link: '/about-judo/oath' },
                { label: 'Принципы дзюдо', link: '/about-judo/principles' }
            ]
        },
        { label: 'Партнеры', link: '/partners' },
        { label: 'Контакты', link: '/contacts' }
    ];

    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = navItems.find(item => 
            currentPath === item.link || 
            (item.dropdownItems && item.dropdownItems.some(dropItem => dropItem.link === currentPath))
        );
        if (activeItem) {
            setActiveButton(activeItem.label);
        }
    }, [location.pathname]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
        document.body.style.overflow = 'auto';
    }, [location]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
        if (isMobileMenuOpen) setOpenDropdown(null);
    };

    const isMobile = window.innerWidth <= 1024;

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <img src={logo} alt="Логотип ФДДНР" className="logo-img" />
                </Link>

                <button 
                    className={`burger-menu ${isMobileMenuOpen ? 'active' : ''}`} 
                    onClick={toggleMobileMenu}
                    aria-label="Меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    {navItems.map((item) => (
                        <div key={item.label} className="nav-item">
                            {item.isDropdown ? (
                                <>
                                    <button
                                        type="button"
                                        className={`button button-primary ${location.pathname === item.link || (item.dropdownItems && item.dropdownItems.some(dropItem => dropItem.link === location.pathname)) ? 'active' : ''}`}
                                        onClick={e => {
                                            if (isMobile) {
                                                e.preventDefault();
                                                setOpenDropdown(openDropdown === item.label ? null : item.label);
                                            } else {
                                                setActiveButton(item.label);
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                    <div className={`dropdown${isMobile && openDropdown === item.label ? ' open' : ''}`}
                                         style={isMobile ? { display: openDropdown === item.label ? 'block' : 'none' } : {}}>
                                        {item.dropdownItems.map((dropItem) => (
                                            <Link
                                                key={dropItem.label}
                                                to={dropItem.link}
                                                className={`dropdown-item ${location.pathname === dropItem.link ? 'active' : ''}`}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {dropItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.link}
                                    className={`button button-primary ${location.pathname === item.link ? 'active' : ''}`}
                                    onClick={() => setActiveButton(item.label)}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
