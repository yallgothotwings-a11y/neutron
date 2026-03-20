import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isSelf: boolean;
}

export function ChatApp({ username }: { username: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'System', text: 'Welcome to the global chat!', timestamp: new Date(), isSelf: false },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      user: username,
      text: input.trim(),
      timestamp: new Date(),
      isSelf: true,
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate a reply
    setTimeout(() => {
      const replies = ['Cool!', 'Nice to meet you.', 'Anyone playing games?', 'How is the proxy working?'];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: 'Guest' + Math.floor(Math.random() * 1000),
        text: randomReply,
        timestamp: new Date(),
        isSelf: false,
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-bg-window">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-text-secondary">{msg.user}</span>
              <span className="text-[10px] text-text-secondary opacity-70">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div 
              className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                msg.isSelf 
                  ? 'bg-accent text-bg-desktop rounded-tr-sm' 
                  : 'bg-bg-taskbar border border-white/10 text-text-primary rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10 bg-bg-taskbar">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-bg-window border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:outline-none focus:border-white/30 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg-desktop p-2 rounded-xl transition-colors flex items-center justify-center w-10 h-10"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
