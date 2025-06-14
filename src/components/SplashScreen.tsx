import React, { useState, useEffect } from 'react';
import { Brain, Zap, AlertTriangle, Sparkles } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const emojis = ['🧠', '💅', '🚩', '🔪', '✨', '👑'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full opacity-40" />
          </div>
        ))}
      </div>

      <div className="text-center relative z-10">
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">
            {emojis[currentEmoji]}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TheFriendAudit
          </h1>
        </div>
        
        <div className="text-xl md:text-2xl text-white font-bold mb-8 animate-pulse">
          Let's find out if they're a vibe or a parasite.
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;