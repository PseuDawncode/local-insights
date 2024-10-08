import React, { useState } from 'react';
import '../App.css';


interface HeaderProps {
  logoUrl: string; 
  title: string;  
  onSearch: (searchTerm: string) => void; 
}

const Header: React.FC<HeaderProps> = ({ logoUrl, title, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="header-container">
    <header className="header">
        <div className="logo-container">
      <img src={logoUrl} alt="Logo" className="logo" />
      </div>
      <div className="title-container">
        <h1 className="title">{title}</h1>
      </div>
      <div className="searchbar-container">
        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Location..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </header>
    </div>
  );
};

export default Header;

