import React, { useState } from 'react';
import '../App.css';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}
const apiKey = process.env.API_KEY

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
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
  );
};

export default SearchBar;
