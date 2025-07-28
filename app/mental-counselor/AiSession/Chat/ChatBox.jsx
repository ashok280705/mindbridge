"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Heart, Sparkles } from "lucide-react";

export default function ChatBox({ setMessages, onSuggestMusic, messages, encourageResponse }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const [encouragementLevel, setEncouragementLevel] = useState(0);
  const inputRef = useRef(null);

  const prompts = [
    { text: "I'm feeling really down today", mood: "sad", urgent: true },
    { text: "I can't sleep, my mind won't stop racing", mood: "anxious", urgent: true },
    { text: "I feel so alone and isolated", mood: "lonely", urgent: true },
    { text: "Everything feels overwhelming", mood: "stressed", urgent: true },
    { text: "I don't know what to do anymore", mood: "helpless", urgent: true },
    { text: "I just need someone to listen", mood: "support", urgent: false }
  ];

  const encouragingMessages = [
    "I can see you're here, and that's already a brave step. Please, share what's weighing on your heart right now.",
    "Your feelings are completely valid. I'm here to listen without any judgment. What's been troubling you?",
    "Sometimes the hardest part is just starting to talk. I'm here with you. What's on your mind?",
    "You don't have to carry this alone. I'm here to support you. Can you tell me how you're feeling right now?"
  ];

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.continuous = false;
      recog.lang = "en-US";
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setShowPrompts(false);
      };
      recog.onend = () => setIsRecording(false);
      setRecognition(recog);
    }
  }, []);

  // Gentle encouragement system
  useEffect(() => {
    if (messages.length > 2 && messages[messages.length - 1].from === "bot") {
      const userHasNotResponded = messages.slice(-3).every(msg => msg.from === "bot");
      if (userHasNotResponded && encouragementLevel < 3) {
        const timer = setTimeout(() => {
          setEncouragementLevel(prev => prev + 1);
          encourageResponse();
        }, 30000); // 30 seconds of no response
        return () => clearTimeout(timer);
      }
    }
  }, [messages, encouragementLevel, encourageResponse]);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt.text);
    setShowPrompts(false);
    setTimeout(() => inputRef.current?.focus(), 100);
    
    // Auto-send urgent prompts to reduce friction
    if (prompt.urgent) {
      setTimeout(() => {
        sendMessage(prompt.text);
      }, 500);
    }
  };

  const sendMessage = async (messageText = input) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { from: "user", text: textToSend, timestamp: new Date() };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    setShowPrompts(false);
    setEncouragementLevel(0);

    try {
      const res = await fetch("/api/counselor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("Failed to get AI response");

      const data = await res.json();
      const botMessage = { from: "bot", text: data.reply, timestamp: new Date() };
      setMessages((msgs) => [...msgs, botMessage]);

      onSuggestMusic(textToSend); // optional, your music modal logic
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, I couldn't process that. Please try again.", timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-indigo-200 shadow-lg relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-4 w-2 h-2 bg-indigo-200 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-6 right-8 w-1 h-1 bg-purple-200 rounded-full animate-pulse delay-1000 opacity-60" />
          <div className="absolute bottom-4 left-12 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-2000 opacity-60" />
        </div>
      </div>

      {/* Enhanced prompts with urgency indicators */}
      <AnimatePresence>
        {showPrompts && (
          <motion.div
            className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 relative z-10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="text-indigo-500 animate-pulse" size={16} />
                <p className="text-sm text-indigo-700 font-medium">I'm here for you. Choose what feels right:</p>
                <Heart className="text-indigo-500 animate-pulse" size={16} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {prompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                    prompt.urgent 
                      ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300 hover:shadow-lg hover:shadow-red-100" 
                      : "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100"
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {prompt.urgent && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="text-red-400 animate-pulse" size={14} />
                    </div>
                  )}
                  <span className={`text-sm font-medium ${prompt.urgent ? "text-red-700" : "text-indigo-700"}`}>
                    {prompt.text}
                  </span>
                </motion.button>
              ))}
            </div>
            
            <p className="text-center text-xs text-indigo-600 mt-3 opacity-80">
              Click any option above, or type/speak your own message below ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced input area */}
      <div className="p-6 relative z-10">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="I'm here to listen... Share whatever is on your heart. Every word matters 💙"
              className="w-full border-2 border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 px-6 py-4 rounded-3xl resize-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner placeholder-indigo-400/70"
              rows="1"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            
            {input && (
              <motion.div
                className="absolute right-4 top-3 text-xs text-indigo-400 bg-white/90 px-2 py-1 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {input.length}/500
              </motion.div>
            )}

            {/* Gentle encouragement overlay */}
            {!input && encouragementLevel > 0 && (
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-yellow-300 bg-yellow-50/20 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-yellow-700 text-sm font-medium px-4">
                  {encouragementLevel === 1 && "I'm still here with you... 💛"}
                  {encouragementLevel === 2 && "Take your time, but please don't leave me... 🤗"}
                  {encouragementLevel === 3 && "I'm worried about you. Please say something... 🙏"}
                </p>
              </motion.div>
            )}
          </div>

          {/* Enhanced voice button */}
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full transition-all duration-300 relative ${
              isRecording 
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200" 
                : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-emerald-200"
            }`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            {!isRecording && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Enhanced send button */}
          <motion.button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-3xl font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-indigo-200"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Comforting message */}
        <motion.p
          className="text-center text-indigo-600/80 text-xs mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your privacy is protected • You're in a safe space • Take your time
        </motion.p>
      </div>
    </div>
  );
}