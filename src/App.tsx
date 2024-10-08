import React from 'react';
import Header from './components/Header';


const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
    
  };

  return (
    <div className="App">
      <Header 
        logoUrl="https://example.com/logo.png" 
        title="Local Travel and Weather Dashboard"
        onSearch={handleSearch} 
      />
      {/* logic */}
    </div>
  );
};

export default App;
