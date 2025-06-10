import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin/admin-layout.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const isActive = (path) => {
        return location.pathname === `/admin${path}`;
    };

    return (
        <div className="admin-layout">
            <nav className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Админ панель</h2>
                </div>
                <ul className="admin-nav">
                    <li>
                        <Link 
                            to="/admin/news" 
                            className={isActive('/news') ? 'active' : ''}
                        >
                            Новости
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/admin/competitions" 
                            className={isActive('/competitions') ? 'active' : ''}
                        >
                            Соревнования
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/admin/calendar" 
                            className={isActive('/calendar') ? 'active' : ''}
                        >
                            Календарь
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/admin/contacts" 
                            className={isActive('/contacts') ? 'active' : ''}
                        >
                            Контакты
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/admin/media" 
                            className={isActive('/media') ? 'active' : ''}
                        >
                            Медиа
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/admin/partners" 
                            className={isActive('/partners') ? 'active' : ''}
                        >
                            Партнеры
                        </Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </nav>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout; 