import React, { useState, useEffect } from 'react';
import { Brain, Zap, Users, MessageSquare, FileText, ChevronDown, Star, AlertTriangle, Heart, LogOut, History, User, Crown, Baseline as Timeline, Upload, Network, FileSignature, Ghost, TrendingUp } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import SplashScreen from './components/SplashScreen';
import QuizSection from './components/QuizSection';
import ResultsSection from './components/ResultsSection';
import TextAnalyzer from './components/TextAnalyzer';
import CompareSection from './components/CompareSection';
import JournalSection from './components/JournalSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import AuthModal from './components/AuthModal';
import AuditHistory from './components/AuditHistory';
import PricingModal from './components/PricingModal';
import FeatureGate from './components/FeatureGate';
import UsageIndicator from './components/UsageIndicator';
import SubscriptionSuccess from './components/SubscriptionSuccess';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('splash');
  const [showSplash, setShowSplash] = useState(true);
  const [quizResults, setQuizResults] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const { user, signOut, loading } = useAuth();
  const { tier, currentPeriodEnd } = useSubscription();

  useEffect(() => {
    // Check if we're on the success page
    if (window.location.pathname === '/subscription-success') {
      setShowSplash(false);
      setCurrentSection('subscription-success');
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentSection('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (section: string) => {
    setCurrentSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrivacyClick = () => {
    setShowPrivacyPolicy(true);
  };

  const handleBackFromPrivacy = () => {
    setShowPrivacyPolicy(false);
  };

  const handleAccountClick = () => {
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleHistoryClick = () => {
    setShowAuditHistory(true);
  };

  const handleBackFromHistory = () => {
    setShowAuditHistory(false);
  };

  const handleUpgradeClick = () => {
    setShowPricingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  if (currentSection === 'subscription-success') {
    return <SubscriptionSuccess />;
  }

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={handleBackFromPrivacy} />;
  }

  if (showAuditHistory) {
    return (
      <div>
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackFromHistory}
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                TheFriendAudit
              </button>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-4">
                    <span className="text-purple-300 text-sm">
                      {user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-purple-300 hover:text-white transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <AuditHistory />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TheFriendAudit
            </div>
            <div className="flex items-center justify-between w-full ml-8">
              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('quiz')}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Audit
                </button>
                <button
                  onClick={() => scrollToSection('tools')}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Tools
                </button>
                {user && (
                  <button
                    onClick={handleHistoryClick}
                    className="text-purple-300 hover:text-white transition-colors flex items-center"
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </button>
                )}
                <button
                  onClick={handleUpgradeClick}
                  className="text-purple-300 hover:text-white transition-colors flex items-center"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Pricing
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {/* Subscription Status */}
                {user && tier !== 'free' && (
                  <div className="hidden md:flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tier === 'trial' ? 'bg-purple-500/20 text-purple-400' :
                      tier === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-pink-500/20 text-pink-400'
                    }`}>
                      {tier.toUpperCase()}
                      {currentPeriodEnd && (
                        <span className="ml-1">
                          (until {currentPeriodEnd.toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-purple-300 text-sm hidden md:block">
                      {user.email}
                    </span>
                    <button
                      onClick={handleHistoryClick}
                      className="text-purple-300 hover:text-white transition-colors md:hidden"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleUpgradeClick}
                      className="text-purple-300 hover:text-white transition-colors md:hidden"
                    >
                      <Crown className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="text-purple-300 hover:text-white transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      <span className="hidden md:inline">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAccountClick}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Audit Your Friendship
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Let's find out if they're a vibe or a parasite. Get brutally honest insights about your friendships.
            </p>
            {!user && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-purple-200 text-sm">
                  <User className="w-4 h-4 inline mr-2" />
                  Sign up to save your audit history and track friendship patterns over time
                </p>
              </div>
            )}
            {user && tier === 'free' && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-purple-200 text-sm mb-2">
                  <Crown className="w-4 h-4 inline mr-2" />
                  Start your 3-day premium trial for unlimited access!
                </p>
                <button
                  onClick={handleUpgradeClick}
                  className="text-purple-400 hover:text-purple-300 font-semibold text-sm"
                >
                  Start Free Trial →
                </button>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => scrollToSection('quiz')}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <Brain className="w-12 h-12 mx-auto mb-4 text-white group-hover:animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Run a New Audit</h3>
              <p className="text-purple-100">10 questions that reveal the truth</p>
            </button>
            
            <button
              onClick={() => scrollToSection('tools')}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white group-hover:animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Toxic Text Analyzer</h3>
              <p className="text-blue-100">Decode manipulative messages</p>
            </button>
            
            <button
              onClick={() => scrollToSection('tools')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25"
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-white group-hover:animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Compare Friends</h3>
              <p className="text-indigo-100">Side-by-side reality check</p>
            </button>
          </div>

          {/* Usage Indicators for Free Users */}
          {user && tier === 'free' && (
            <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <UsageIndicator feature="basic_audit" />
              <UsageIndicator feature="text_analysis" />
            </div>
          )}

          <button
            onClick={() => scrollToSection('quiz')}
            className="bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors flex items-center mx-auto group"
          >
            Start the Audit
            <ChevronDown className="ml-2 w-5 h-5 group-hover:animate-bounce" />
          </button>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="min-h-screen px-6 py-20">
        <FeatureGate 
          feature="basic_audit" 
          onUpgradeClick={handleUpgradeClick}
          fallback={
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Weekly Audit Limit Reached
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                You've used all 10 audits this week. Upgrade for unlimited access!
              </p>
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          }
        >
          <QuizSection onComplete={setQuizResults} />
        </FeatureGate>
      </section>

      {/* Results Section */}
      {quizResults && (
        <section id="results" className="min-h-screen px-6 py-20">
          <ResultsSection results={quizResults} />
        </section>
      )}

      {/* Tools Section */}
      <section id="tools" className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Friendship Tools
            </h2>
            <p className="text-xl text-purple-200">
              Deep dive into the dynamics of your relationships
            </p>
          </div>

          {/* Basic Tools */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <FeatureGate 
                feature="text_analysis" 
                onUpgradeClick={handleUpgradeClick}
                fallback={
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold text-white mb-2">Daily Limit Reached</h3>
                    <p className="text-gray-300 mb-4">You've used all 5 text analyses today.</p>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors"
                    >
                      Upgrade for Unlimited
                    </button>
                  </div>
                }
              >
                <TextAnalyzer />
              </FeatureGate>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <FeatureGate 
                feature="compare_friends" 
                onUpgradeClick={handleUpgradeClick}
              >
                <CompareSection />
              </FeatureGate>
            </div>
          </div>

          {/* Journal Section */}
          <div className="mb-12">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
              <FeatureGate 
                feature="journal" 
                onUpgradeClick={handleUpgradeClick}
              >
                <JournalSection />
              </FeatureGate>
            </div>
          </div>

          {/* Advanced Tools Section */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Advanced Features
            </h3>
            <p className="text-center text-purple-200 mb-12">
              Unlock powerful tools to analyze friendship patterns and dynamics
            </p>
          </div>

          {/* Pro Tier Features */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <FeatureGate 
              feature="red_flag_timeline" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <Timeline className="w-16 h-16 mx-auto mb-4 text-orange-400 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Red Flag Timeline</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Track friendship moments over time and detect patterns of toxic behavior with AI-powered analysis.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <p className="text-blue-200 text-xs">Available in Pro & Premium</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Timeline className="w-8 h-8 mr-3 text-orange-400" />
                  <h3 className="text-2xl font-bold text-white">Red Flag Timeline</h3>
                </div>
                <p className="text-gray-300">Track friendship moments and detect toxic patterns over time.</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="drama_history_importer" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Drama History Importer</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Upload WhatsApp, Messenger, or iMessage exports. AI highlights behavioral cycles like ghosting and guilt-trips.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <p className="text-blue-200 text-xs">Available in Pro & Premium</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Upload className="w-8 h-8 mr-3 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">Drama History Importer</h3>
                </div>
                <p className="text-gray-300">Import chat histories to analyze behavioral patterns.</p>
              </div>
            </FeatureGate>
          </div>

          {/* Premium Tier Features */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <FeatureGate 
              feature="friend_group_dynamics" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <Network className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Friend Group Dynamics</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Visualize energy flow in your friend group. See who drains, who uplifts, and who stays neutral.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                      <p className="text-purple-200 text-xs">Premium Exclusive</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Network className="w-8 h-8 mr-3 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">Group Dynamics</h3>
                </div>
                <p className="text-gray-300">Map your entire friend group's energy flow.</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="friendship_contracts" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <FileSignature className="w-16 h-16 mx-auto mb-4 text-pink-400 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Friendship Contracts</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Generate boundary-setting agreements. Send to friends as a quiz or playful pact.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                      <p className="text-purple-200 text-xs">Premium Exclusive</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <FileSignature className="w-8 h-8 mr-3 text-pink-400" />
                  <h3 className="text-2xl font-bold text-white">Friendship Contracts</h3>
                </div>
                <p className="text-gray-300">Create boundary-setting agreements for healthier friendships.</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="ghost_mode" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <Ghost className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Ghost Mode</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      AI suggests slow-fade vs. hard-cutoff strategies. Includes suggested texts or "Do Nothing & Detach" pathways.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                      <p className="text-purple-200 text-xs">Premium Exclusive</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <Ghost className="w-8 h-8 mr-3 text-gray-400" />
                  <h3 className="text-2xl font-bold text-white">Ghost Mode</h3>
                </div>
                <p className="text-gray-300">Strategic exit planning with AI-suggested approaches.</p>
              </div>
            </FeatureGate>
          </div>

          {/* Toxicity Leaderboard - Premium Feature */}
          <div className="mb-12">
            <FeatureGate 
              feature="toxicity_leaderboard" 
              onUpgradeClick={handleUpgradeClick}
              fallback={
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-yellow-400 opacity-50" />
                    <h3 className="text-2xl font-bold text-white mb-4">Toxicity Leaderboard</h3>
                    <p className="text-gray-300 text-sm mb-6">
                      See anonymized global stats: most common red flags, most ghosted friendship types, and top toxic phrases of the week.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6 opacity-50">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Most Common Red Flag</h4>
                        <p className="text-red-400">"You're being dramatic"</p>
                        <p className="text-gray-400 text-xs">Detected in 34% of toxic conversations</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Most Ghosted Type</h4>
                        <p className="text-yellow-400">Energy Vampires</p>
                        <p className="text-gray-400 text-xs">67% fade-out rate</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Toxic Phrase of the Week</h4>
                        <p className="text-red-400">"If you really cared..."</p>
                        <p className="text-gray-400 text-xs">↑ 23% usage this week</p>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                      <p className="text-purple-200 text-xs">Premium Exclusive Feature</p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Unlock Toxicity Insights
                    </button>
                  </div>
                </div>
              }
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 mr-3 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Toxicity Leaderboard</h3>
                </div>
                <p className="text-gray-300">Global insights into friendship toxicity trends.</p>
              </div>
            </FeatureGate>
          </div>

          {/* Upgrade CTA */}
          <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Unlock All Features?</h3>
            <p className="text-purple-200 mb-6">
              Get unlimited access to all friendship analysis tools and advanced features
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors"
              >
                Pro - $9.99/month
              </button>
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Premium - $14.99/month
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-purple-500/20 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-purple-200 text-lg mb-4">
            This site won't fix your friendships—but it <em>will</em> expose the BS.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-purple-300">
            <button 
              onClick={handlePrivacyClick}
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={handleUpgradeClick}
              className="hover:text-white transition-colors"
            >
              Pricing
            </button>
          </div>
          <div className="mt-8 text-sm text-purple-400">
            © 2025 TheFriendAudit.com - Reality checks for your social circle
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;