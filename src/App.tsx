import React from 'react';
import Header from './components/Header';
import Departures from './components/Departures';


const App: React.FC = () => {


  return (
    <div className="App">
      <Header 
        logoSrc="/images/logo.png"
        title="Local Travel and Weather Dashboard"
        
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
