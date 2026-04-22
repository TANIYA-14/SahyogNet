import React, { useState } from 'react';
import SubmitNeed from './pages/SubmitNeed';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';

function App() {
  const [currentView, setCurrentView] = useState('submit');
  const [selectedNeedId, setSelectedNeedId] = useState(null);

  const handleOpenMatches = (needId) => {
    setSelectedNeedId(needId);
    setCurrentView('matches');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">SahyogNet</h1>
        <p className="text-gray-500 mt-2 text-lg">Smart Resource Allocation for NGOs</p>
        
        {currentView !== 'matches' && (
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => setCurrentView('submit')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${currentView === 'submit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Submit Need (Field Worker)
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Admin Dashboard
            </button>
          </div>
        )}
      </div>

      {currentView === 'submit' && <SubmitNeed />}
      {currentView === 'dashboard' && <Dashboard onMatch={handleOpenMatches} />}
      {currentView === 'matches' && <Matches needId={selectedNeedId} onBack={() => setCurrentView('dashboard')} />}
    </div>
  );
}

export default App;
