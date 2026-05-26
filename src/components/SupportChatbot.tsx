import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Sparkles, User, HelpCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'admin' | 'bot';
  text: string;
  timestamp: string;
}

interface SupportChatbotProps {
  userEmail: string;
  userName: string;
  userRole: string;
  isAuthenticated: boolean;
  activeTicketMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onOpenAuth: () => void;
}

export default function SupportChatbot({
  userEmail,
  userName,
  userRole,
  isAuthenticated,
  activeTicketMessages,
  onSendMessage,
  isOpen,
  setIsOpen,
  onOpenAuth
}: SupportChatbotProps) {
  const [typedMsg, setTypedMsg] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTicketMessages, isOpen]);

  const handleSend = () => {
    if (!typedMsg.trim()) return;
    onSendMessage(typedMsg.trim());
    setTypedMsg('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans" id="trust-safety-chat-bubble">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-full shadow-2xl text-white transform hover:scale-105 transition-all duration-300 flex items-center justify-center relative border border-blue-500/30 group"
          id="chat-toggle-pill"
          title="Open Trust & Safety Admin Line"
        >
          <MessageSquare className="w-5 h-5 animate-pulse-slow group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-mono font-bold uppercase tracking-wider block ml-0 group-hover:ml-1.5 whitespace-nowrap">
            Support Line
          </span>
          {/* Active notification indicator */}
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border border-slate-950 animate-ping" />
          <span className="absolute -top-1 -right-1 bg-red-550 w-3 h-3 rounded-full border border-slate-950" />
        </button>
      )}

      {/* Expanded Chatbot Drawer Overlay */}
      {isOpen && (
        <div 
          className="bg-slate-900 border border-slate-800 rounded-2xl w-80 sm:w-96 h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl animate-fade-in"
          id="chat-viewport"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between" id="chat-header-row">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-900/40">
                <ShieldCheck className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                  <span>Trust &amp; Quality Hotline</span>
                  <span className="text-[8px] bg-blue-955 text-blue-400 px-1 py-0.2 rounded border border-blue-900/50">24/7 Support</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Anti-scam listings auditor line</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              id="clos-chat-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Sign-In Banner if Not Authenticated */}
          {!isAuthenticated && (
            <div className="p-2.5 bg-blue-950/40 border-b border-blue-900/30 text-[10px] text-slate-300 font-mono flex items-center justify-between gap-2" id="unauth-tips">
              <span>⚠️ Linked ticket needs active user profile.</span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-blue-400 hover:underline font-bold"
              >
                Sign-In
              </button>
            </div>
          )}

          {/* Messages Stream Container */}
          <div 
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-900/40 flex flex-col"
            id="chat-messages-scroll"
            ref={scrollRef}
          >
            <div className="text-center py-1">
              <span className="text-[8px] bg-slate-950 border border-slate-850 text-slate-500 font-mono px-2 py-0.5 rounded-full uppercase">
                Secure SSL encryption connection
              </span>
            </div>

            {activeTicketMessages.map((msg, idx) => {
              const isMe = msg.sender === 'user';
              let senderName = 'Guest Seeker';
              if (msg.sender === 'bot') senderName = 'Safety Desk Bot';
              else if (msg.sender === 'admin') senderName = 'Moderator Admin';
              else if (userName) senderName = userName;

              return (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  id={`chat-line-${idx}`}
                >
                  <div
                    className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.sender === 'bot'
                        ? 'bg-slate-950 border border-slate-850 text-slate-300 rounded-bl-none'
                        : 'bg-indigo-950 border border-indigo-900 text-indigo-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-normal">{msg.text}</p>
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                    <span>{senderName}</span>
                    <span>&bull;</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Tag */}
          <div className="px-3 py-1.5 border-t border-slate-850 bg-slate-950/60 flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar" id="predefined-chat-prompts">
            {[
              'Suspect outdated pricing on prop-1',
              'Report fake photos copycat coordinates',
              'Verify my private seller deed credentials',
              'How are broker review counts checked?'
            ].map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onSendMessage(promptText);
                }}
                className="text-[9px] font-mono bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full transition-colors flex items-center gap-0.5"
              >
                <HelpCircle className="w-2.5 h-2.5 text-blue-500" />
                <span>{promptText}</span>
              </button>
            ))}
          </div>

          {/* Write Text Console */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-1.5" id="chat-input-bar">
            <input
              type="text"
              placeholder={isAuthenticated ? "Send support query..." : "Please sign in to message..."}
              disabled={false}
              value={typedMsg}
              onChange={(e) => setTypedMsg(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-slate-900 border border-slate-850 focus:border-blue-500 rounded-lg text-xs placeholder-slate-700 px-2.5 py-1.5 text-slate-100 focus:outline-none"
              id="support-composer"
            />
            <button
              onClick={handleSend}
              className="p-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
              id="support-send"
              title="Submit message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
