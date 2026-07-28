import React from 'react';
import { Target, GitMerge, Trophy, ShoppingBag, Sun, Moon, Shield, BookOpen } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  const navItems = [
    { id: 'targeting', label: 'Star Targeting', icon: Target },
    { id: 'advisor', label: 'Smart Prestige Advisor', icon: GitMerge },
    { id: 'tournaments', label: 'Monthly Tournaments', icon: Trophy },
    { id: 'market', label: 'Market Analytics', icon: ShoppingBag },
    { id: 'guide', label: 'Guide', icon: BookOpen }
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="navbar-title">PSS Unified Portal</h1>
          <p className="navbar-subtitle">Analytics & Strategy Dashboard</p>
        </div>
      </div>

      <nav className="navbar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="navbar-actions">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle-btn"
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
