import React from 'react';
import { Search, Plus, MonitorPlay, Gamepad2, Globe, MessageSquare, Settings } from 'lucide-react';

interface DesktopProps {
  openWindow: (app: any) => void;
}

export function Desktop({ openWindow }: DesktopProps) {
  const apps = [
    { id: 'browser', title: 'Google', icon: <Globe size={24} className="text-blue-400" /> },
    { id: 'browser-yt', title: 'YouTube', icon: <MonitorPlay size={24} className="text-red-500" /> },
    { id: 'games', title: 'Games', icon: <Gamepad2 size={24} className="text-green-400" /> },
    { id: 'chat', title: 'Chat', icon: <MessageSquare size={24} className="text-pink-400" /> },
    { id: 'settings', title: 'Settings', icon: <Settings size={24} className="text-gray-400" /> },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-6 border-2 border-white rounded flex items-center justify-center gap-0.5">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold tracking-widest text-white">NEUTRON</h1>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-8 w-full max-w-[600px]">
        <div 
          onClick={() => openWindow({ id: 'browser', title: 'Browser' })}
          className="flex-1 h-12 bg-bg-taskbar border border-white/10 rounded-xl flex items-center px-4 cursor-text hover:border-white/30 transition-colors"
        >
          <Search size={18} className="text-text-secondary mr-3" />
          <span className="text-text-secondary text-sm font-medium">Search</span>
        </div>
        <button className="w-16 h-12 bg-bg-taskbar border border-white/10 rounded-xl flex items-center justify-center hover:border-white/30 transition-colors">
          <Globe size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* App Grid */}
      <div className="flex flex-wrap justify-center gap-3 max-w-[800px]">
        {apps.map(app => (
          <button
            key={app.id}
            onClick={() => openWindow({ id: app.id.startsWith('browser') ? 'browser' : app.id, title: app.title })}
            className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl bg-bg-window border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-bg-taskbar flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {app.icon}
            </div>
            <span className="text-xs font-medium text-text-primary">{app.title}</span>
          </button>
        ))}
        
        {/* Add Button */}
        <button className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl bg-bg-window border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-full bg-bg-taskbar flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus size={20} className="text-text-secondary" />
          </div>
          <span className="text-xs font-medium text-text-primary">Add</span>
        </button>
      </div>
    </div>
  );
}
