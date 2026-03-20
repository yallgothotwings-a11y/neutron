import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Shield, Globe, Plus, X, Star } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Tab {
  id: string;
  url: string;
  currentUrl: string;
  title: string;
  isLoading: boolean;
}

interface SortableTabProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent | React.PointerEvent) => void;
}

const SortableTab: React.FC<SortableTabProps> = ({ tab, isActive, onClick, onClose }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] border-r border-white/10 cursor-default group ${
        isActive ? 'bg-bg-window text-text-primary' : 'bg-bg-taskbar text-text-secondary hover:bg-white/5'
      }`}
    >
      <Globe size={14} className="shrink-0" />
      <span className="text-xs truncate flex-1 select-none">{tab.title}</span>
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          onClose(e);
        }}
        onClick={(e) => e.stopPropagation()}
        className={`shrink-0 p-0.5 rounded-md hover:bg-white/10 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <X size={12} />
      </button>
    </div>
  );
}

export function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'tab-1', url: '', currentUrl: 'about:blank', title: 'New Tab', isLoading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [isDraggingTab, setIsDraggingTab] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDraggingTab(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([...tabs, { id: newId, url: '', currentUrl: 'about:blank', title: 'New Tab', isLoading: false }]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent | React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      const newId = `tab-${Date.now()}`;
      setTabs([{ id: newId, url: '', currentUrl: 'about:blank', title: 'New Tab', isLoading: false }]);
      setActiveTabId(newId);
      return;
    }
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = activeTab.url.trim();
    
    if (!finalUrl) return;
    
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(finalUrl);
      }
    }
    
    // Proxy logic using Ultraviolet
    try {
      const uvConfig = (window as any).__uv$config;
      if (uvConfig) {
        const encoded = uvConfig.encodeUrl(finalUrl);
        const proxyUrl = uvConfig.prefix + encoded;
        
        updateActiveTab({
          isLoading: true,
          currentUrl: proxyUrl,
          url: finalUrl,
          title: finalUrl
        });
      } else {
        throw new Error("UV config not found");
      }
    } catch (e) {
      console.warn("UV proxy not available, falling back to direct URL", e);
      updateActiveTab({
        isLoading: true,
        currentUrl: finalUrl,
        url: finalUrl,
        title: finalUrl
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-window">
      {/* Tabs Bar */}
      <div className="flex items-center bg-bg-taskbar border-b border-white/10 overflow-x-auto no-scrollbar">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={() => setIsDraggingTab(true)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setIsDraggingTab(false)}
        >
          <SortableContext 
            items={tabs.map(t => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex">
              {tabs.map(tab => (
                <SortableTab 
                  key={tab.id} 
                  tab={tab} 
                  isActive={tab.id === activeTabId}
                  onClick={() => setActiveTabId(tab.id)}
                  onClose={(e) => closeTab(e, tab.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <button 
          onClick={addTab}
          className="p-1.5 mx-1 rounded-md hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Browser Chrome */}
      <div className="h-12 bg-bg-window border-b border-white/10 flex items-center px-2 gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              const iframe = document.getElementById(`browser-iframe-${activeTabId}`) as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                try { iframe.contentWindow.history.back(); } catch (e) {}
              }
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              const iframe = document.getElementById(`browser-iframe-${activeTabId}`) as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                try { iframe.contentWindow.history.forward(); } catch (e) {}
              }
            }}
          >
            <ArrowRight size={16} />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              updateActiveTab({ isLoading: true });
              const iframe = document.getElementById(`browser-iframe-${activeTabId}`) as HTMLIFrameElement;
              if (iframe) iframe.src = iframe.src;
            }}
          >
            <RotateCw size={16} className={activeTab.isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="relative w-full flex items-center">
            <div className="absolute left-3 text-text-secondary">
              <Shield size={14} />
            </div>
            <input
              type="text"
              value={activeTab.url}
              onChange={(e) => updateActiveTab({ url: e.target.value })}
              placeholder="Search or enter web address"
              className="w-full bg-bg-taskbar border border-white/10 rounded-full py-1 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </form>
      </div>
      
      {/* Browser Content */}
      <div className="flex-1 bg-white relative">
        {isDraggingTab && <div className="absolute inset-0 z-50 bg-transparent" />}
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            className={`absolute inset-0 ${tab.id === activeTabId ? 'z-10' : 'z-0 hidden'}`}
          >
            {tab.currentUrl === 'about:blank' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary bg-bg-window">
                <Globe size={64} className="mb-4 opacity-20" />
                <div className="flex items-center gap-2">
                  <Star className="text-accent" size={24} fill="currentColor" />
                  <h2 className="text-xl font-medium text-text-secondary">Neutron Proxy</h2>
                </div>
                <p className="text-sm mt-2">Enter a URL to browse securely.</p>
                <div className="mt-8 p-4 bg-bg-taskbar rounded-xl border border-white/10 max-w-md text-center">
                  <p className="text-xs text-text-secondary">
                    Note: This is a frontend placeholder. To fully bypass CORS and unblock sites, 
                    you need to integrate a backend proxy like Ultraviolet (UV) or Tompkin.
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                id={`browser-iframe-${tab.id}`}
                src={tab.currentUrl}
                className="w-full h-full border-none bg-white"
                onLoad={() => {
                  setTabs(currentTabs => 
                    currentTabs.map(t => t.id === tab.id ? { ...t, isLoading: false } : t)
                  );
                }}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
