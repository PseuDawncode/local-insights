import React from 'react';
import Header from './components/Header';
import Departures from './components/Departures';


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
      <Departures />
    </div>
  );
};

export default App;
