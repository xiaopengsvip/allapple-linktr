
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { AI_KNOWLEDGE_BASE, AI_SUGGESTIONS, STYLES, SHARE_CONFIG } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, lang }) => {
  const [input, setInput] = useState('');
  // 默认第一条消息
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: lang === 'zh' ? "您好！我是 Everett 的 AI 助手。我可以为您介绍产品、查询加密货币行情或导航生态系统。" : "Hello! I am Everett's AI Assistant. I can introduce products, check crypto trends, or navigate the ecosystem.",
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

  // 当语言切换时更新欢迎语（仅当对话为空或只有一条默认消息时）
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'bot') {
       setMessages([{
          id: '1',
          text: lang === 'zh' ? "您好！我是 Everett 的 AI 助手。我可以为您介绍产品、查询加密货币行情或导航生态系统。" : "Hello! I am Everett's AI Assistant. I can introduce products, check crypto trends, or navigate the ecosystem.",
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
      // 如果没有 API Key，抛出错误以触发本地兜底回复
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // [核心] 中文系统指令，增强角色扮演和对新功能的认知
      const systemInstruction = lang === 'zh'
        ? `你是 Everett 品牌的 AI 智能助手。Everett 是一个融合科技、艺术、情感和去中心化金融的未来生活方式品牌。
           
           你的性格：专业、未来感、略带幽默、乐于助人。
           你的核心知识库：
           1. **产品**：Everett 拥有全息交互设备、星际订阅服务。
           2. **金融 (Crypto)**：网站包含 CryptoHub 板块，提供 BTC, ETH 等 K 线分析。
           3. **生态 (Ecosystem)**：网站集成了一个名为“生态”的子系统，通过导航栏点击可进入全屏体验。
           4. **联系**：创始人是 Xiao Peng，可以通过底部的 X (Twitter) 图标关注我们。
           
           回答规则：
           - 尽量使用中文回答。
           - 保持简练，不要长篇大论。
           - 如果用户问如何购买，引导他们去“定制”板块。
           - 如果用户问 X 或 Twitter，告诉他们页面底部有链接。`
        : `You are the AI assistant for Everett, a futuristic brand merging tech, art, and DeFi. 
           Be professional, futuristic, and helpful.
           Key Knowledge:
           1. Products: Holographic devices, Interstellar subscription.
           2. Crypto: We have a CryptoHub section for market analysis.
           3. Ecosystem: Users can access the 'Ecosystem' portal via the nav bar.
           4. Contact: Founder Xiao Peng, users can follow on X (Twitter) at the bottom.
           If asked about X/Twitter, guide them to the bottom of the page.`;

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
      
      // 本地兜底逻辑
      const knowledge = AI_KNOWLEDGE_BASE[lang] as any;
      const responseText = knowledge[text] || (lang === 'zh' ? "抱歉，主脑连接信号微弱（API Key缺失），但我仍然为您服务。您可以浏览金融板块或点击底部图标关注我们的 X。" : "Signal weak. Please check out our Crypto Hub or follow us on X.");
      
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
      {/* 聊天界面模态框 */}
      {isOpen && (
        <div className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-[380px] z-[100] h-[500px] max-h-[70vh] flex flex-col ${STYLES.glassModal} rounded-2xl animate-fade-in overflow-hidden shadow-2xl border border-white/20`}>
          {/* 标题栏 */}
          <div className="p-4 bg-accent/10 border-b border-accent/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent animate-pulse" size={20} />
              <span className="font-orbitron font-bold text-white">Everett AI Live</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* 消息区域 */}
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

          {/* 快捷建议 */}
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

          {/* 输入框区域 */}
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
