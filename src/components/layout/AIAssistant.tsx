import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greetings Commander. UrbanSync AI Core (India Region) is online. How can I assist with infrastructure recovery across the subcontinent today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      const isQuotaError = response.status === 429 || 
                          data.error?.includes('429') || 
                          data.error?.toLowerCase().includes('quota') || 
                          data.code === 'insufficient_quota';

      if (!response.ok && isQuotaError) {
        console.warn("OpenAI Quota Exceeded. Falling back to Gemini...");
        try {
          const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            config: {
              systemInstruction: "You are the UrbanSync AI Core (India Region). Help with urban infrastructure recovery in Indian metropolitan cities. Be technical and precise. (Falling back from OpenAI due to quota limits)",
            }
          });
          setMessages(prev => [...prev, { role: 'assistant', content: result.text || 'No response.' }]);
          return;
        } catch (geminiError: any) {
          console.error("Gemini Fallback Error:", geminiError);
          throw new Error("Both OpenAI and Gemini intelligence cores are unavailable. System degraded.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || 'Neural link disruption');
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'No response.' }]);
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Performance degraded: ${error.message || 'Connection to Neural Link lost'}.` }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform border border-white/10"
      >
        {isOpen ? <X size={24} /> : <div className="relative"><MessageSquare size={24} /><div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"></div></div>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">AI CORE_V.04</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-success-green rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Link</span>
                  </div>
                </div>
              </div>
              <Sparkles size={16} className="text-blue-400 opacity-50" />
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  m.role === 'user' ? "flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    m.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-slate-900 text-white"
                  )}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm max-w-[80%] shadow-sm",
                    m.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  )}>
                    <div className="markdown-body">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Inquire status, ask for plan..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                UrbanSync Neural Link // 256-bit encryption active
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
