import React, { useEffect } from 'react'
import { CheckCircle, ArrowRight, Crown } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

const SubscriptionSuccess: React.FC = () => {
  const { refreshSubscription, tier } = useSubscription()

  useEffect(() => {
    // Refresh subscription data when component mounts
    const timer = setTimeout(() => {
      refreshSubscription()
    }, 2000)

    return () => clearTimeout(timer)
  }, [refreshSubscription])

  const handleContinue = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Welcome to Premium!
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Your subscription has been activated successfully. You now have access to all premium features!
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">
              {tier === 'premium' ? 'Premium' : tier === 'pro' ? 'Pro' : tier === 'trial' ? 'Trial' : 'Premium'} Features Unlocked
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="space-y-3">
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Unlimited friendship audits</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Full toxic text analyzer</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>AI-powered recommendations</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Complete journaling tools</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Emotional pattern tracking</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Friend comparison tools</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Advanced analytics</span>
              </div>
              {tier === 'premium' && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Friendship circle mapping</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center mx-auto"
          >
            Start Auditing Friends
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <p className="text-gray-400 text-sm">
            You can manage your subscription anytime from your account settings
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSuccess