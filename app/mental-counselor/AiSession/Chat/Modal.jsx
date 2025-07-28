"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, X, Music, Heart, Headphones } from "lucide-react";

export default function Modal({ music, onClose, isUrgent = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (music && audioRef.current) {
      audioRef.current.load();
      // Show encouragement after a delay
      setTimeout(() => setShowEncouragement(true), 3000);
    }
  }, [music]);

  // Auto-play if urgent (user seems distressed)
  useEffect(() => {
    if (music && isUrgent && audioRef.current) {
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 1000);
    }
  }, [music, isUrgent]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!music) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-60" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-6 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-40" />
            <div className="absolute top-12 right-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-1000 opacity-40" />
            <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse delay-2000 opacity-40" />
            <div className="absolute bottom-16 right-6 w-1 h-1 bg-indigo-200 rounded-full animate-pulse delay-3000 opacity-40" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="relative z-10">
            {/* Header with pulsing music icon */}
            <div className="text-center mb-6">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center relative"
                animate={{ 
                  rotate: isPlaying ? 360 : 0,
                  scale: isPlaying ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Music size={32} className="text-white" />
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-white/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Heart className="text-red-400 animate-pulse" size={20} />
                Healing Music
                <Heart className="text-red-400 animate-pulse" size={20} />
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isUrgent 
                  ? "I can sense you're in pain. Let this music help soothe your heart 💜" 
                  : "Take a deep breath and let this music bring you peace"
                }
              </motion.p>
            </div>

            {/* Music info with enhanced styling */}
            <motion.div
              className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Headphones className="text-indigo-600" size={20} />
                <p className="font-semibold text-gray-800">{music.name}</p>
              </div>
              
              {/* Audio element */}
              <audio
                ref={audioRef}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              >
                <source src={music.url} type="audio/mpeg" />
              </audio>

              {/* Enhanced audio controls */}
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="font-mono">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative cursor-pointer overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    {isPlaying && (
                      <motion.div
                        className="absolute top-0 right-0 w-2 h-3 bg-white/50 rounded-full"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <span className="font-mono">{formatTime(duration)}</span>
                </div>

                {/* Play/pause button with enhanced styling */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Encouragement message */}
            <AnimatePresence>
              {showEncouragement && (
                <motion.div
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="text-yellow-600 animate-pulse" size={16} />
                    <p className="text-yellow-800 font-medium text-sm">Gentle Reminder</p>
                  </div>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    You're taking care of yourself by being here. Music can help calm your nervous system and reduce stress hormones. You're doing something beautiful for your wellbeing. 🌱
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-colors"
              >
                I'm Ready to Continue
              </button>
              <button
                onClick={togglePlay}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Volume2 size={16} />
                {isPlaying ? 'Pause' : 'Play Music'}
              </button>
            </motion.div>

            {/* Therapeutic message */}
            <motion.p
              className="text-center text-gray-500 text-xs mt-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              Music therapy can reduce anxiety by up to 65%. You're giving yourself a powerful tool for healing. 💙
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}