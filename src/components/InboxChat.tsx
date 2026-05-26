import React, { useState, useEffect } from 'react';
import { Inquiry, Property } from '../types';
import { Mail, Phone, Calendar, Clock, Edit3, Send, CheckSquare, ChevronRight, User, ThumbsUp, Tag, Plus, Check } from 'lucide-react';

interface InboxChatProps {
  inquiries: Inquiry[];
  properties: Property[];
  onUpdateInquiry: (inquiryId: string, updatedFields: Partial<Inquiry>) => void;
  currentRole: 'seeker' | 'agent' | 'owner';
  activeClientEmail?: string;
}

const QUICK_REPLIES = [
  'Thank you for reaching out! This property is indeed active. What day works best for a walkthrough?',
  'I have confirmed the paperwork. The lot parameters are fully clear. Lets schedule a phone call.',
  'Great news, the landlord is willing to accept well-behaved pets. Id love to schedule a visit.',
  'Yes! The parking spaces are private, climate-controlled, and completely secure for parking. Let me know when you would like to visit.'
];

export default function InboxChat({
  inquiries,
  properties,
  onUpdateInquiry,
  currentRole,
  activeClientEmail
}: InboxChatProps) {
  const [selectedInqId, setSelectedInqId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Set default selected inquiry
  useEffect(() => {
    if (inquiries.length > 0 && !selectedInqId) {
      setSelectedInqId(inquiries[0].id);
    }
  }, [inquiries, selectedInqId]);

  const activeInq = inquiries.find((i) => i.id === selectedInqId);

  const sendMessage = () => {
    if (!typedMessage.trim() || !activeInq) return;

    const newChatElement = {
      sender: currentRole === 'seeker' ? ('seeker' as const) : ('agent' as const),
      message: typedMessage,
      timestamp: new Date().toISOString()
    };

    const newChatHistory = [...(activeInq.chatHistory || []), newChatElement];
    onUpdateInquiry(activeInq.id, { chatHistory: newChatHistory });
    setTypedMessage('');
  };

  const handleQuickKeyClick = (reply: string) => {
    setTypedMessage(reply);
  };

  const addLeadNote = () => {
    if (!newNote.trim() || !activeInq) return;
    const notesArray = activeInq.notes || [];
    const updatedNotes = [...notesArray, newNote.trim()];
    onUpdateInquiry(activeInq.id, { notes: updatedNotes });
    setNewNote('');
  };

  const handleStatusChange = (newStatus: Inquiry['status']) => {
    if (!activeInq) return;
    onUpdateInquiry(activeInq.id, { status: newStatus });
  };

  const handleTimeReview = (status: 'approved' | 'reschedule' | 'cancelled') => {
    if (!activeInq) return;
    // Embed a private note simulation or update details
    const messageAlert = `[SYSTEM] Viewing request was ${status} by the management core.`;
    const updatedChatHistory = [
      ...(activeInq.chatHistory || []),
      { sender: 'agent' as const, message: messageAlert, timestamp: new Date().toISOString() }
    ];
    onUpdateInquiry(activeInq.id, { chatHistory: updatedChatHistory });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[580px] text-slate-100" id="inquiry-crm-cockpit">
      {/* Sidebar section: Inquiry lists */}
      <div className="w-full md:w-80 border-r border-slate-900 flex flex-col h-1/3 md:h-full bg-slate-950" id="crm-sidebar">
        <div className="p-4 border-b border-slate-900 bg-slate-900/40 flex justify-between items-center" id="crm-sidebar-hdr">
          <div id="crm-sidebar-label">
            <h4 className="font-bold text-white text-xs tracking-tight uppercase">Inquiry Leads Desk</h4>
            <p className="text-[10px] text-slate-500">Pipeline & CRM Contacts</p>
          </div>
          <span className="text-[10px] text-blue-400 bg-blue-950 border border-blue-900/60 px-2 py-0.5 rounded-full font-bold">
            {inquiries.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-900/80 p-2 space-y-1" id="crm-inquiries-list">
          {inquiries.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs" id="no-leads">
              No client inquiries registered yet. Ensure seekers schedule walk sessions first.
            </div>
          ) : (
            inquiries.map((inq) => {
              const isSelected = inq.id === selectedInqId;
              const matchesRole = true; // In simple app workspace, showcase all inquiries so the user can easily swap roles to preview them!

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInqId(inq.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/50 border border-blue-800/80 text-white'
                      : 'border border-transparent hover:bg-slate-900/50 text-slate-400'
                  }`}
                  id={`crm-inq-card-${inq.id}`}
                >
                  <div className="flex items-center gap-2 mb-1.5 justify-between">
                    <span className="text-[10px] font-bold text-white truncate max-w-[130px] flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {inq.seekerName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase ${
                      inq.status === 'new'
                        ? 'bg-blue-600/25 text-blue-400 border border-blue-800/40'
                        : inq.status === 'viewing'
                        ? 'bg-amber-600/25 text-amber-500 border border-amber-800/40'
                        : inq.status === 'closed'
                        ? 'bg-emerald-600/25 text-emerald-400 border border-emerald-800/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  
                  <h6 className="text-[11px] font-semibold text-slate-300 truncate">{inq.propertyTitle}</h6>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{inq.message || 'No initial message text.'}</p>
                  
                  <div className="flex justify-between items-center text-[9px] font-mono mt-1.5 text-slate-600">
                    <span>{inq.createdDate}</span>
                    {inq.preferredDate && (
                      <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                        <Calendar className="w-2.5 h-2.5" /> Scheduled
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Column workspace: Chat thread & Actions */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full relative bg-slate-900/20" id="crm-main-viewport">
        {activeInq ? (
          <>
            {/* Header detailing lead info & property links */}
            <div className="p-4 bg-slate-950 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3" id="crm-viewport-hdr">
              <div className="flex items-center gap-3">
                <img
                  src={activeInq.propertyPhoto}
                  alt={activeInq.propertyTitle}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                />
                <div>
                  <h3 className="font-bold text-white text-xs tracking-tight line-clamp-1 pr-1">
                    {activeInq.propertyTitle}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-blue-300">Client: {activeInq.seekerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({activeInq.seekerEmail})</span>
                  </p>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-900 p-1 rounded-lg border border-slate-800" id="crm-status-adjuster">
                <span className="text-[9px] font-bold text-slate-400 px-1.5 uppercase font-mono">Lead Stage</span>
                <select
                  value={activeInq.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-blue-500 font-semibold"
                  id="crm-status-spinner"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="viewing">Viewing</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="closed">Closed Deal</option>
                  <option value="lost">Lost / Archived</option>
                </select>
              </div>
            </div>

            {/* Split workarea: Chat Stream & CRM Lead Notebook block */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" id="inq-chat-split">
              {/* Chat thread */}
              <div className="flex-1 flex flex-col h-full border-b lg:border-b-0 lg:border-r border-slate-900" id="chat-thread-box">
                {/* Scrollable messages bubble stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5" id="chat-message-scroll">
                  <div className="flex justify-center" id="chat-origin-system">
                    <span className="bg-slate-950 border border-slate-900 text-slate-500 font-mono text-[9px] uppercase px-3 py-1 rounded-full">
                      System: Correspondence opened on {activeInq.createdDate}
                    </span>
                  </div>

                  {/* Seed Message Box */}
                  <div className="flex flex-col max-w-[85%] self-start" id="chat-bubble-seed">
                    <div className="bg-slate-900 text-xs p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-800 text-slate-200">
                      <p className="font-semibold text-blue-400 text-[10px] mb-1 font-mono uppercase">Inquiry Message</p>
                      <p className="leading-relaxed">{activeInq.message}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono">{activeInq.createdDate}</span>
                  </div>

                  {/* Back and forth messages */}
                  {activeInq.chatHistory && activeInq.chatHistory.map((elem, idx) => {
                    const isMyMsg = elem.sender === (currentRole === 'seeker' ? 'seeker' : 'agent');
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[80%] ${isMyMsg ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        id={`chat-bubble-${idx}`}
                      >
                        <div className={`p-2.5 rounded-xl text-xs ${
                          elem.message.startsWith('[SYSTEM]')
                            ? 'bg-amber-950/20 border border-amber-900/40 text-amber-300 italic font-mono text-[10px]'
                            : isMyMsg
                            ? 'bg-blue-600 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tr-xl rounded-bl-xl rounded-br-xl'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{elem.message}</p>
                        </div>
                        <span className="text-[8px] text-slate-600 font-mono mt-0.5">
                          {elem.sender === 'seeker' ? 'Client' : 'Management'} &bull; {new Date(elem.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick replies keyboard row */}
                {currentRole !== 'seeker' && (
                  <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/50 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap" id="chat-quick-keys">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider self-center pr-1.5 font-mono">Reply Presets:</span>
                    {QUICK_REPLIES.map((rep, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleQuickKeyClick(rep)}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium transition-colors"
                        id={`quick-reply-key-${idx}`}
                      >
                        Template {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Write message input footer */}
                <div className="p-3 bg-slate-950 border-t border-slate-900 flex gap-2" id="chat-input-bar">
                  <input
                    type="text"
                    placeholder={`Compose message as ${currentRole === 'seeker' ? 'Client Seeker' : 'Real Estate Agent'}...`}
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg text-xs placeholder-slate-600 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    id="chat-composer"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all flex items-center justify-center"
                    id="chat-send-btn"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Side CRM Notebook: Scheduled Walkings, viewing calendars & Admin private memory notes */}
              <div className="w-full lg:w-64 bg-slate-950/80 p-4 space-y-4 flex flex-col overflow-y-auto" id="chat-notebook">
                {/* Section A: Viewing calendar info card */}
                {activeInq.preferredDate && (
                  <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-xs space-y-2.5" id="viewing-booking-card">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 animate-pulse" />
                      <span>Viewing Requested</span>
                    </span>
                    
                    <div className="bg-slate-950 p-2 rounded border border-slate-900 space-y-1.5 font-mono" id="scheduled-params">
                      <p className="text-[11px] text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Date: {activeInq.preferredDate}</span>
                      </p>
                      <p className="text-[11px] text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Time: {activeInq.preferredTime || '12:00 PM'}</span>
                      </p>
                    </div>

                    {currentRole !== 'seeker' && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1" id="scheduler-review-triggers">
                        <button
                          type="button"
                          onClick={() => handleTimeReview('approved')}
                          className="py-1 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white transition-all flex items-center justify-center gap-0.5"
                          id="confirm-booking"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTimeReview('cancelled')}
                          className="py-1 rounded bg-slate-800 hover:bg-red-950/40 hover:text-red-400 border border-slate-700/80 text-[10px] font-semibold text-slate-300 transition-all"
                          id="decline-booking"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Section B: Private Note Tracker */}
                <div className="space-y-2 flex-1 flex flex-col" id="lead-notes-area">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    Broker Lead Notes
                  </span>
                  
                  {/* Notes Feed */}
                  <div className="space-y-1.5 max-h-40 overflow-y-auto flex-1" id="lead-notes-list">
                    {!activeInq.notes || activeInq.notes.length === 0 ? (
                      <p className="text-[10px] text-slate-600 italic">No notes on the client profile recorded.</p>
                    ) : (
                      activeInq.notes.map((note, noteIdx) => (
                        <div key={noteIdx} className="bg-slate-900 border border-slate-800/80 p-2 rounded text-[10px] text-slate-300 leading-snug">
                          {note}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Note Creator Input */}
                  <div className="flex gap-1.5 pt-1.5 border-t border-slate-900" id="note-creator">
                    <input
                      type="text"
                      placeholder="Add private lead note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addLeadNote();
                      }}
                      className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-[10px] text-white placeholder-slate-600 flex-1 focus:outline-none focus:border-blue-500"
                      id="lead-notes-input"
                    />
                    <button
                      onClick={addLeadNote}
                      className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded text-slate-500 transition-colors"
                      id="lead-notes-submit"
                      title="Add note"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-8 text-center" id="empty-chats">
            <Mail className="w-12 h-12 stroke-slate-700/80 mb-3 animate-bounce" />
            <p className="text-sm font-semibold text-white">Select a CRM Inquiry</p>
            <p className="text-xs max-w-sm mt-1">
              Select any of the client inquiry records listed in the sidebar to initiate real-time communication simulation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
