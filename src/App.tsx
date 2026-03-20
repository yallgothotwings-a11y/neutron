import React, { useState, useEffect } from 'react';
import { SetupModal } from './components/SetupModal';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { WindowManager } from './components/WindowManager';

export type Theme = 'ocean' | 'classic' | 'midnight' | 'sakura' | 'emerald' | 'sunset' | 'cyberpunk' | 'dracula' | 'hacker' | 'monochrome';

export interface UserSettings {
  username: string;
  theme: Theme;
}

export interface AppWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export default function App() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('virtualDesktopSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    document.body.className = '';
    if (theme !== 'classic') {
      document.body.classList.add(`theme-${theme}`);
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    localStorage.setItem('virtualDesktopSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    applyTheme(newSettings.theme);
  };

  const openWindow = (app: Omit<AppWindow, 'isOpen' | 'isMinimized' | 'zIndex'>) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === app.id);
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      
      if (existing) {
        return prev.map(w => w.id === app.id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
      }
      return [...prev, { ...app, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }];
    });
    setActiveWindowId(app.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => {
      const nextWindows = prev.filter(w => w.id !== id);
      if (activeWindowId === id) {
        const visibleWindows = nextWindows.filter(w => !w.isMinimized);
        if (visibleWindows.length > 0) {
          const nextActive = visibleWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
          setActiveWindowId(nextActive.id);
        } else {
          setActiveWindowId(null);
        }
      }
      return nextWindows;
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => {
      const nextWindows = prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
      if (activeWindowId === id) {
        const visibleWindows = nextWindows.filter(w => !w.isMinimized);
        if (visibleWindows.length > 0) {
          const nextActive = visibleWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
          setActiveWindowId(nextActive.id);
        } else {
          setActiveWindowId(null);
        }
      }
      return nextWindows;
    });
  };

  const focusWindow = (id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
    setActiveWindowId(id);
  };

  if (!settings) {
    return <SetupModal onSave={handleSaveSettings} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-bg-desktop text-text-primary relative">
      <div className="absolute inset-0 stars-bg z-0 pointer-events-none"></div>
      <div className="absolute inset-0 grid-overlay z-0 pointer-events-none"></div>
      
      <div className="relative z-10 flex-1 overflow-hidden">
        <Desktop openWindow={openWindow} />
        <WindowManager 
          windows={windows} 
          closeWindow={closeWindow} 
          minimizeWindow={minimizeWindow}
          focusWindow={focusWindow}
          activeWindowId={activeWindowId}
          settings={settings}
          onUpdateSettings={handleSaveSettings}
        />
      </div>
      
      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId}
        focusWindow={focusWindow}
        openWindow={openWindow}
      />
    </div>
  );
}
