import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, ThumbsUp, User } from 'lucide-react';
import { useAuditStorage } from '../hooks/useAuditStorage';
import { useAuth } from '../contexts/AuthContext';

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [friendName, setFriendName] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { saveAuditResult, isAuthenticated } = useAuditStorage();

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(async () => {
      const toxicPatterns = [
        { pattern: /you never|you always/gi, flag: 'Absolute statements', severity: 'medium' },
        { pattern: /it's your fault|you made me/gi, flag: 'Blame shifting', severity: 'high' },
        { pattern: /you're being dramatic|you're overreacting/gi, flag: 'Invalidation', severity: 'high' },
        { pattern: /fine|whatever|sure/gi, flag: 'Passive aggression', severity: 'medium' },
        { pattern: /if you really cared|if you loved me/gi, flag: 'Emotional manipulation', severity: 'high' },
        { pattern: /everyone thinks|nobody likes/gi, flag: 'False consensus', severity: 'medium' },
      ];

      const positivePatterns = [
        { pattern: /thank you|i appreciate/gi, flag: 'Gratitude' },
        { pattern: /i understand|i see your point/gi, flag: 'Validation' },
        { pattern: /how are you|how's your/gi, flag: 'Genuine interest' },
        { pattern: /i'm sorry|my bad/gi, flag: 'Accountability' },
      ];

      const foundToxic = toxicPatterns.filter(p => p.pattern.test(text));
      const foundPositive = positivePatterns.filter(p => p.pattern.test(text));
      
      const toxicityScore = foundToxic.reduce((score, flag) => {
        return score + (flag.severity === 'high' ? 3 : flag.severity === 'medium' ? 2 : 1);
      }, 0);

      const positivityScore = foundPositive.length * 2;
      const overallScore = Math.max(0, Math.min(100, 50 + positivityScore - toxicityScore * 10));

      const analysisResult = {
        toxicFlags: foundToxic,
        positiveFlags: foundPositive,
        toxicityScore,
        positivityScore,
        overallScore,
        verdict: overallScore >= 70 ? 'Healthy' : overallScore >= 40 ? 'Neutral' : 'Problematic',
        analyzedText: text
      };

      // Save to database if user is authenticated and friend name is provided
      if (isAuthenticated && friendName.trim()) {
        await saveAuditResult(friendName, 'text_analysis', analysisResult);
      }

      setAnalysis(analysisResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <MessageSquare className="w-8 h-8 mr-3 text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Toxic Text Analyzer</h3>
      </div>
      
      <div className="space-y-6">
        {isAuthenticated && (
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-2">
              Friend's name (optional - for saving to history):
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Friend's name or nickname"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-purple-300 text-sm font-medium mb-2">
            Paste a message or conversation:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste their message here..."
            className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
        
        <button
          onClick={analyzeText}
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
        </button>
        
        {analysis && (
          <div className="bg-gray-700/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Analysis Results</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.verdict === 'Healthy' ? 'bg-green-500/20 text-green-400' :
                analysis.verdict === 'Neutral' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {analysis.verdict}
              </div>
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  analysis.overallScore >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  analysis.overallScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${analysis.overallScore}%` }}
              />
            </div>
            
            {analysis.toxicFlags.length > 0 && (
              <div>
                <h5 className="text-red-400 font-medium mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Red Flags Detected
                </h5>
                <div className="space-y-2">
                  {analysis.toxicFlags.map((flag: any, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        flag.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-gray-300">{flag.flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.positiveFlags.length > 0 && (
              <div>
                <h5 className="text-green-400 font-medium mb-2 flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Positive Signals
                </h5>
                <div className="space-y-2">
                  {analysis.positiveFlags.map((flag: any, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      <span className="text-gray-300">{flag.flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated && friendName.trim() && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mt-4">
                <p className="text-purple-200 text-sm">
                  ✓ Analysis saved to your audit history for {friendName}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAnalyzer;