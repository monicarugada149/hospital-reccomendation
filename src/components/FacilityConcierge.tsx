import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { DiagnosticAnalysis } from '../types/diagnostic';

interface FacilityConciergeProps {
  diagnosticContext: DiagnosticAnalysis | null;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FacilityConcierge: React.FC<FacilityConciergeProps> = ({ diagnosticContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: diagnosticContext
        ? `Hello, I'm your DiagHospital Clinical Navigator. I've reviewed your ${diagnosticContext.modality} analysis. You can ask me anything about the recommended hospitals, equipment on-site (such as 3T MRI or Level 1 Trauma), appointment logistics, or how to prepare your referral questions.`
        : 'Welcome! Upload a diagnostic scan or select a sample scan above, and I can answer questions about matching hospitals, imaging modalities, and appointment preparation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const suggestedQuestions = diagnosticContext
    ? [
        `What should I bring if I need a follow-up with contrast at ${diagnosticContext.recommendedFacilities[0]?.name || 'the facility'}?`,
        'How do I transfer my DICOM scan CD to the hospital ahead of my visit?',
        'What is the difference between a community hospital and an academic medical center for this condition?',
      ]
    : [
        'How does DiagHospital match hospitals to diagnostic scans?',
        'What types of imaging modalities are supported?',
      ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat-facility-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q.trim(),
          diagnosticContext,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'No response from assistant');
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'I apologize, but I encountered an error communicating with the facility concierge service. Please check your network connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[420px]">
      {/* Concierge Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Facility Navigator & Appointment Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              Assisting with hospital logistics, equipment questions & visit prep
            </div>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto items-center text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>Consulting hospital knowledge graph...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
        <span className="text-slate-400 font-medium shrink-0">Quick ask:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-600 rounded-md whitespace-nowrap transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hospital equipment, parking, insurance, or appointment prep..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
