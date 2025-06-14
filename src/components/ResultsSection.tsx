import React from 'react';
import { AlertTriangle, Heart, Shield, TrendingUp, Eye, EyeOff, Crown } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import FeatureGate from './FeatureGate';

interface ResultsSectionProps {
  results: {
    score: number;
    percentage: number;
    grade: string;
    color: string;
    description: string;
    redFlags: number;
    answers: number[];
    friendName?: string;
  };
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const { canUseFeature } = useSubscription();

  const getGradeIcon = () => {
    switch (results.color) {
      case 'green':
        return <Heart className="w-16 h-16 text-green-400" />;
      case 'yellow':
        return <Shield className="w-16 h-16 text-yellow-400" />;
      case 'red':
        return <AlertTriangle className="w-16 h-16 text-red-400" />;
      default:
        return <Heart className="w-16 h-16 text-gray-400" />;
    }
  };

  const getGradeColor = () => {
    switch (results.color) {
      case 'green':
        return 'from-green-500 to-emerald-500';
      case 'yellow':
        return 'from-yellow-500 to-orange-500';
      case 'red':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const energyDrainIndex = Math.max(0, 100 - results.percentage);
  const showFullResults = canUseFeature('full_results');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Friendship Verdict
        </h2>
        <p className="text-xl text-purple-200">
          The algorithm has spoken. Here's your reality check.
        </p>
      </div>

      {/* Main Result Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getGradeIcon()}
          </div>
          <h3 className={`text-4xl font-black mb-4 bg-gradient-to-r ${getGradeColor()} bg-clip-text text-transparent`}>
            {results.grade}
          </h3>
          <div className="text-6xl font-bold text-white mb-2">
            {results.percentage.toFixed(0)}%
          </div>
          <div className="text-purple-300">
            Friendship Quality Score
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
          <p className="text-lg text-gray-200 leading-relaxed">
            {results.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-700/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {results.redFlags}
            </div>
            <div className="text-purple-300 text-sm">
              Red Flags Detected
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-xl p-6 text-center relative">
            {!showFullResults && (
              <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <EyeOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400 text-sm">Premium Feature</p>
                </div>
              </div>
            )}
            <div className={`text-3xl font-bold text-orange-400 mb-2 ${!showFullResults ? 'blur-sm' : ''}`}>
              {energyDrainIndex}%
            </div>
            <div className="text-purple-300 text-sm">
              Energy Drain Index
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {results.score}/30
            </div>
            <div className="text-purple-300 text-sm">
              Total Score
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Radar - Premium Feature */}
      <FeatureGate 
        feature="emotional_radar"
        fallback={
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-48 h-48 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-bold text-white mb-2">Emotional Radar</h3>
                    <p className="text-gray-300 text-sm mb-4">See detailed emotional patterns and triggers</p>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors">
                      Upgrade to Unlock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">
            Emotional Radar
          </h4>
          <div className="w-48 h-48 mx-auto bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{results.percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-300">Emotional Health</div>
            </div>
          </div>
        </div>
      </FeatureGate>

      {/* Action Recommendations */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
        <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
          What to do next
        </h4>
        
        {results.color === 'green' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
              <p className="text-gray-200">Invest more time in this friendship - they're worth it</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
              <p className="text-gray-200">Express gratitude for their support</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
              <p className="text-gray-200">Use this friendship as a template for future connections</p>
            </div>
          </div>
        )}

        {results.color === 'yellow' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
              <p className="text-gray-200">Keep things casual - don't overinvest emotionally</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
              <p className="text-gray-200">Enjoy the fun times but don't rely on them for deep support</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
              <p className="text-gray-200">Monitor for improvements or decline over time</p>
            </div>
          </div>
        )}

        {results.color === 'red' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
              <p className="text-gray-200">Set clear boundaries to protect your energy</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
              <p className="text-gray-200">Consider gradually reducing contact</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
              <p className="text-gray-200">Focus on building healthier relationships</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Simulator - Premium Feature */}
      <FeatureGate 
        feature="ai_simulator"
        fallback={
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="text-center">
              <Crown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">"Stay or Leave" AI Simulator</h3>
              <p className="text-gray-300 text-sm mb-4">Get personalized AI recommendations based on your specific situation</p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        }
      >
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
          <h4 className="text-2xl font-bold text-white mb-6">AI Recommendation</h4>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <p className="text-purple-200">
              Based on your audit results, our AI suggests: 
              <span className="font-bold">
                {results.percentage >= 70 ? ' Invest more in this friendship' :
                 results.percentage >= 40 ? ' Maintain casual boundaries' :
                 ' Consider distancing yourself gradually'}
              </span>
            </p>
          </div>
        </div>
      </FeatureGate>

      {/* Call to Action */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors mr-4"
        >
          Audit Another Friend
        </button>
        <button
          onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-600 transition-colors"
        >
          Explore Tools
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;