"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Shield, Clock } from "lucide-react";
import ChatBox from "./ChatBox";
import MusicModal from "./Modal";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [music, setMusic] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const musicLibrary = [
    { name: "Gentle Mind - Relaxing Piano", url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3" },
    { name: "Peaceful Waters - Nature Sounds", url: "https://www.bensound.com/bensound-music/bensound-dreams.mp3" },
    { name: "Meditation Bell - Mindfulness", url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3" },
    { name: "Soft Rain - Sleep Sounds", url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3" },
  ];

  const onSuggestMusic = (text) => {
    const stressKeywords = ["sad", "depressed", "anxious", "worried", "stressed", "overwhelmed", "lonely", "alone", "tired", "exhausted", "panic", "nervous"];
    const textLower = text.toLowerCase();
    
    const hasStressKeyword = stressKeywords.some(keyword => textLower.includes(keyword));
    
    if (hasStressKeyword) {
      const randomMusic = musicLibrary[Math.floor(Math.random() * musicLibrary.length)];
      setTimeout(() => setMusic(randomMusic), 2500);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show typing indicator when bot is responding
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].from === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">MindfulChat</h1>
              <p className="text-sm text-gray-600">Your compassionate AI counselor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Welcome message when no messages */}
          {messages.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <MessageCircle size={32} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to MindfulChat</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                This is a safe, judgment-free space where you can share your thoughts and feelings. 
                I'm here to listen and provide support whenever you need it.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Clock className="text-indigo-600 mb-3 mx-auto" size={24} />
                  <h3 className="font-medium text-gray-800 mb-2">Available 24/7</h3>
                  <p className="text-gray-600 text-sm">Always here when you need support</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Shield className="text-indigo-600 mb-3 mx-auto" size={24} />
                  <h3 className="font-medium text-gray-800 mb-2">Confidential</h3>
                  <p className="text-gray-600 text-sm">Your conversations are private and secure</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Heart className="text-indigo-600 mb-3 mx-auto" size={24} />
                  <h3 className="font-medium text-gray-800 mb-2">Compassionate</h3>
                  <p className="text-gray-600 text-sm">Non-judgmental support with empathy</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl shadow-sm ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.timestamp && (
                      <p className={`text-xs mt-2 ${
                        msg.from === "user" ? "text-indigo-100" : "text-gray-500"
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart size={12} className="text-white" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-gray-500 text-sm">Counselor is typing...</span>
                </div>
              </motion.div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatBox 
        setMessages={setMessages} 
        onSuggestMusic={onSuggestMusic}
        messages={messages}
      />
      
      {/* Music Modal */}
      <MusicModal music={music} onClose={() => setMusic(null)} />
    </div>
  );
}