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
      <div className='main-container'>
        <Departures />
        <div className='temp weather'/>
        <div className='temp opt-info'/>
        <div className='temp traffic'/>
      </div>
      
    </div>
  );
};

export default App;
