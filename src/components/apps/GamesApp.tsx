import React, { useState, useEffect } from 'react';
import { Play, Search, ArrowLeft } from 'lucide-react';
import { gamesList, Game } from '../../data/games';

export function GamesApp() {
  const [search, setSearch] = useState('');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameHtml, setGameHtml] = useState<string | null>(null);

  const filteredGames = gamesList.filter(game => 
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
    setIsLoading(true);
    
    const encoded = encodeURIComponent(game.file);
    // Use raw.githack.com to serve the HTML with the correct Content-Type
    const url = `https://raw.githack.com/bubbls/ugs-singlefile/main/UGS-Files/${encoded}`;
    setGameHtml(url);
  };

  if (activeGame) {
    return (
      <div className="flex flex-col h-full w-full bg-bg-window">
        <div className="h-14 bg-bg-taskbar border-b border-white/10 flex items-center px-4 gap-4 shrink-0">
          <button 
            onClick={() => {
              setActiveGame(null);
              setGameHtml(null);
            }}
            className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-text-primary font-medium">{activeGame.name}</h2>
        </div>
        <div className="flex-1 bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-text-secondary z-10 bg-black">
              Loading game...
            </div>
          )}
          {gameHtml && (
            <iframe
              src={gameHtml}
              className="w-full h-full border-none relative z-20"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-bg-window">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Game Library</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-taskbar border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredGames.map((game, index) => (
          <div 
            key={index} 
            onClick={() => handlePlayGame(game)}
            className="group relative rounded-xl overflow-hidden bg-bg-taskbar border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col"
          >
            <div className="h-24 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={32} className="text-white/50 group-hover:text-white/90 transition-colors group-hover:scale-110 transform duration-300" />
            </div>
            <div className="p-3 flex-1 flex items-center justify-center text-center">
              <h3 className="text-sm font-medium text-text-primary line-clamp-2">{game.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {filteredGames.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          No games found matching "{search}"
        </div>
      )}
    </div>
  );
}
