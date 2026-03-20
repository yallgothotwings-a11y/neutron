import React from 'react';
import { AppWindow, UserSettings } from '../App';
import { BrowserApp } from './apps/BrowserApp';
import { ChatApp } from './apps/ChatApp';
import { GamesApp } from './apps/GamesApp';
import { SettingsApp } from './apps/SettingsApp';
import { X, Minus } from 'lucide-react';

interface WindowManagerProps {
  windows: AppWindow[];
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  activeWindowId: string | null;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export function WindowManager({ 
  windows, 
  closeWindow, 
  minimizeWindow, 
  focusWindow, 
  activeWindowId,
  settings,
  onUpdateSettings
}: WindowManagerProps) {
  
  const renderAppContent = (id: string) => {
    switch (id) {
      case 'browser': return <BrowserApp />;
      case 'chat': return <ChatApp username={settings.username} />;
      case 'games': return <GamesApp />;
      case 'settings': return <SettingsApp settings={settings} onUpdateSettings={onUpdateSettings} />;
      default: return <div>App not found</div>;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {windows.map(w => (
        <div
          key={w.id}
          className="absolute inset-0 flex flex-col bg-bg-window pointer-events-auto"
          style={{ 
            display: activeWindowId === w.id && !w.isMinimized ? 'flex' : 'none',
            zIndex: w.zIndex 
          }}
        >
          {/* Simple Static Header */}
          <div className="h-12 bg-bg-taskbar border-b border-white/10 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 text-text-primary text-sm font-medium">
              {w.title}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => minimizeWindow(w.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <button 
                onClick={() => closeWindow(w.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          {/* App Content */}
          <div className="flex-1 overflow-hidden relative">
            {renderAppContent(w.id)}
          </div>
        </div>
      ))}
    </div>
  );
}
