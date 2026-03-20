import React, { useState } from 'react';
import { Theme, UserSettings } from '../App';
import { Palette, ChevronRight, Lock, Star } from 'lucide-react';

interface SetupModalProps {
  onSave: (settings: UserSettings) => void;
}

export function SetupModal({ onSave }: SetupModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<Theme>('ocean');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onSave({ username: username.trim(), theme });
    }
  };

  return (
    <div className={`fixed inset-0 bg-bg-desktop flex items-center justify-center z-50 theme-${theme}`}>
      <div className="absolute inset-0 stars-bg opacity-30"></div>
      <div className="absolute inset-0 grid-overlay opacity-30"></div>
      
      <div className="bg-bg-window border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-bg-taskbar border border-white/10 flex items-center justify-center">
            <Lock className="text-text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <Star className="text-accent" size={24} fill="currentColor" />
              Neutron Login
            </h1>
            <p className="text-text-secondary text-sm">Enter your credentials</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-bg-taskbar border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-white/30 transition-all"
              placeholder="Username"
              required
              maxLength={20}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-taskbar border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-white/30 transition-all"
              placeholder="Password"
              required
            />
          </div>

          <div className="pt-2">
            <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-semibold">Select Theme</p>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <ThemeOption 
                id="ocean" 
                label="Ocean" 
                selected={theme === 'ocean'} 
                onClick={() => setTheme('ocean')} 
                gradient="from-blue-900 to-black"
              />
              <ThemeOption 
                id="classic" 
                label="Dark" 
                selected={theme === 'classic'} 
                onClick={() => setTheme('classic')} 
                gradient="from-gray-700 to-gray-900"
              />
              <ThemeOption 
                id="midnight" 
                label="Midnight" 
                selected={theme === 'midnight'} 
                onClick={() => setTheme('midnight')}
                gradient="from-indigo-900 to-blue-900"
              />
              <ThemeOption 
                id="sakura" 
                label="Sakura" 
                selected={theme === 'sakura'} 
                onClick={() => setTheme('sakura')}
                gradient="from-pink-900 to-purple-900"
              />
              <ThemeOption 
                id="emerald" 
                label="Emerald" 
                selected={theme === 'emerald'} 
                onClick={() => setTheme('emerald')}
                gradient="from-emerald-600 to-teal-900"
              />
              <ThemeOption 
                id="sunset" 
                label="Sunset" 
                selected={theme === 'sunset'} 
                onClick={() => setTheme('sunset')}
                gradient="from-orange-500 to-pink-600"
              />
              <ThemeOption 
                id="cyberpunk" 
                label="Cyberpunk" 
                selected={theme === 'cyberpunk'} 
                onClick={() => setTheme('cyberpunk')}
                gradient="from-yellow-400 to-pink-500"
              />
              <ThemeOption 
                id="dracula" 
                label="Dracula" 
                selected={theme === 'dracula'} 
                onClick={() => setTheme('dracula')}
                gradient="from-purple-600 to-pink-500"
              />
              <ThemeOption 
                id="hacker" 
                label="Hacker" 
                selected={theme === 'hacker'} 
                onClick={() => setTheme('hacker')}
                gradient="from-green-500 to-green-900"
              />
              <ThemeOption 
                id="monochrome" 
                label="Monochrome" 
                selected={theme === 'monochrome'} 
                onClick={() => setTheme('monochrome')}
                gradient="from-gray-200 to-gray-600"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!username.trim() || !password.trim()}
              className="w-12 h-12 bg-bg-taskbar border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:hover:border-white/10 text-text-primary rounded-xl flex items-center justify-center transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ThemeOption({ label, selected, onClick, gradient }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        selected 
          ? 'border-accent bg-white/10' 
          : 'border-white/10 hover:border-white/30 bg-bg-taskbar'
      }`}
    >
      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradient}`}></div>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </button>
  );
}
