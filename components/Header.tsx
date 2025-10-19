
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          7K UPSC
        </h1>
      </div>
    </header>
  );
};

export default Header;
