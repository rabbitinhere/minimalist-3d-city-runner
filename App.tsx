
import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-slate-100 flex flex-col items-center justify-center overflow-hidden">
      <Game />
      {/* Mobile touch controls could be added here for a better experience */}
    </div>
  );
};

export default App;
