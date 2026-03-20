import React, { useState } from 'react';
import { UserSettings, Theme } from '../../App';
import { Monitor, Moon, Flower2, Gem, Save } from 'lucide-react';

interface SettingsAppProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export function SettingsApp({ settings, onUpdateSettings }: SettingsAppProps) {
  const [username, setUsername] = useState(settings.username);
  const [theme, setTheme] = useState<Theme>(settings.theme);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (username.trim()) {
      onUpdateSettings({ username: username.trim(), theme });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-bg-window text-text-primary">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-8 max-w-lg">
        {/* Profile Section */}
        <div className="bg-bg-taskbar border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-bg-window border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:outline-none focus:border-white/30 transition-all"
              maxLength={20}
            />
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-bg-taskbar border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Theme Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
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

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-bg-desktop px-6 py-2.5 rounded-xl transition-colors font-medium"
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({ label, selected, onClick, gradient }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
        selected 
          ? 'border-accent bg-white/10' 
          : 'border-white/10 hover:border-white/30 bg-bg-window'
      }`}
    >
      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradient}`}></div>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </button>
  );
}
