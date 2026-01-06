import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaHistory, FaTrophy, FaUser } from 'react-icons/fa';
import './BottomNav.css';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/growth', icon: FaChartLine, label: '成長', isCenter: false },
        { path: '/history', icon: FaHistory, label: '履歴', isCenter: false },
        { path: '/home', icon: FaHome, label: 'ホーム', isCenter: true }, // Center item
        { path: '/achievements', icon: FaTrophy, label: '称号', isCenter: false },
        { path: '/profile', icon: FaUser, label: 'プロフ', isCenter: false }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`bottom-nav-item ${isActive ? 'active' : ''} ${item.isCenter ? 'center-item' : ''}`}
                    >
                        <div className={`bottom-nav-icon-wrapper ${item.isCenter ? 'center-icon' : ''}`}>
                            <IconComponent className="bottom-nav-icon" />
                        </div>
                        <span className="bottom-nav-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
