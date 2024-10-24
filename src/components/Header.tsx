import React from 'react';
import '../App.css';

interface HeaderProps {
  title: string;
  logoSrc: string; 
}

const Header: React.FC<HeaderProps> = ({ title, logoSrc }) => {
  return (
    <div className="header-container">
      <header className="header">
        {/* Logo Section */}
        <div className="logo-container">
          <img src={logoSrc} alt="Logo" className="logo" />
        </div>
        
        {/* Title Section */}
        <div className="title-container">
          <h1 className="title">{title}</h1>
        </div>
      </header>
    </div>
  );
};

export default Header;

