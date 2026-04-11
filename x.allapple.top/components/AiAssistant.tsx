
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { AI_KNOWLEDGE_BASE, AI_SUGGESTIONS, STYLES } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, lang }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: lang === 'zh' ? "您好！我是 Everett 的 AI 助手。有什么我可以帮您的吗？" : "Hello! I am Everett's AI Assistant. How can I help you?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Update default greeting if language changes and chat is empty
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'bot') {
       setMessages([{
          id: '1',
          text: lang === 'zh' ? "您好！我是 Everett 的 AI 助手。有什么我可以帮您的吗？" : "Hello! I am Everett's AI Assistant. How can I help you?",
          sender: 'bot',
          timestamp: new Date()
       }]);
    }
  }, [lang]);


  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY;
      // If no API key is available, throw error to trigger fallback
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      // Construct history
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const systemInstruction = lang === 'zh'
        ? "你是 Everett 的 AI 助手。Everett 是一个融合科技、艺术和情感的未来生活方式品牌。你的回答应该是专业、简练且充满未来感的。如果用户询问产品，请重点介绍全息交互、星际订阅和可持续能源管理功能。"
        : "You are the AI assistant for Everett, a futuristic lifestyle brand merging tech, art, and emotion. Your answers should be professional, concise, and futuristic. If asked about products, highlight holographic interaction, interstellar subscription, and sustainable energy management.";

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history
      });

      const result = await chat.sendMessage({ message: text });
      const responseText = result.text;

      const newBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMsg]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      
      // Fallback to static knowledge base
      const knowledge = AI_KNOWLEDGE_BASE[lang] as any;
      const responseText = knowledge[text] || (lang === 'zh' ? "抱歉，主脑连接暂时中断，但我仍然为您服务。Everett 是未来的生活方式。" : "Connection to the Core interrupted. Everett remains your future lifestyle.");
      
      const newBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  return (
    <>
      {/* Chat Interface Modal */}
      {isOpen && (
        <div className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-[380px] z-[100] h-[500px] max-h-[70vh] flex flex-col ${STYLES.glassModal} rounded-2xl animate-fade-in overflow-hidden shadow-2xl border border-white/20`}>
          {/* Header */}
          <div className="p-4 bg-accent/10 border-b border-accent/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent animate-pulse" size={20} />
              <span className="font-orbitron font-bold text-white">Everett AI Live</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-700' : 'bg-accent/20 border border-accent/50'}`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} className="text-accent" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-white text-black rounded-tr-none' 
                      : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center">
                     <Bot size={14} className="text-accent" />
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar-hide">
            {AI_SUGGESTIONS[lang].map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-accent hover:text-white border border-white/10 rounded-full text-xs text-gray-300 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={lang === 'zh' ? "输入消息..." : "Type a message..."}
              className={`flex-1 ${STYLES.glassInput} text-white text-sm rounded-xl px-4 py-2 outline-none transition-colors placeholder-gray-500`}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim()}
              className="p-2 bg-accent rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
