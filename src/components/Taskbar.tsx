import React, { useState, useEffect } from 'react';
import { AppWindow } from '../App';
import { Menu, Globe, Gamepad2, Settings, MessageSquare, Star } from 'lucide-react';

interface TaskbarProps {
  windows: AppWindow[];
  activeWindowId: string | null;
  focusWindow: (id: string) => void;
  openWindow: (app: any) => void;
}

export function Taskbar({ windows, activeWindowId, focusWindow, openWindow }: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'browser', title: 'Browser', icon: <Globe size={20} /> },
    { id: 'games', title: 'Games', icon: <Gamepad2 size={20} /> },
    { id: 'chat', title: 'Chat', icon: <MessageSquare size={20} /> },
    { id: 'settings', title: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="relative z-50">
      {startOpen && (
        <div className="absolute bottom-16 left-2 w-64 bg-bg-window border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <Star className="text-accent" size={18} fill="currentColor" />
            <h3 className="text-text-primary font-semibold">Neutron</h3>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  openWindow(app);
                  setStartOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-left text-text-primary"
              >
                <div className="text-text-secondary">{app.icon}</div>
                <span className="text-sm font-medium">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-14 bg-bg-taskbar border-t border-white/10 flex items-center px-2 justify-between">
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${startOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <Star className="text-accent animate-glisten" size={22} fill="currentColor" />
          </button>
          
          <div className="w-px h-6 bg-white/10 mx-1"></div>
          
          {windows.map(w => (
            <button
              key={w.id}
              onClick={() => focusWindow(w.id)}
              className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all max-w-[160px] ${
                activeWindowId === w.id && !w.isMinimized
                  ? 'bg-white/10 border-b-2 border-accent'
                  : 'hover:bg-white/5 border-b-2 border-transparent'
              }`}
            >
              <div className="text-text-secondary shrink-0">
                {w.id === 'browser' && <Globe size={16} />}
                {w.id === 'games' && <Gamepad2 size={16} />}
                {w.id === 'chat' && <MessageSquare size={16} />}
                {w.id === 'settings' && <Settings size={16} />}
              </div>
              <span className="text-xs font-medium text-text-primary truncate">{w.title}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center px-4 h-10 rounded-xl hover:bg-white/5 transition-colors cursor-default text-text-secondary text-xs font-medium tracking-wider">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
