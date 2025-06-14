import React from 'react'
import { Lock, Crown, Sparkles, Clock } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
  onUpgradeClick?: () => void
}

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true,
  onUpgradeClick 
}) => {
  const { canUseFeature, getRemainingUsage, tier } = useSubscription()

  if (canUseFeature(feature)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const remainingUsage = getRemainingUsage(feature)
  
  const getUpgradeMessage = () => {
    switch (feature) {
      case 'basic_audit':
        return `You've used all ${10 - remainingUsage}/10 audits this week. Upgrade for unlimited audits!`
      case 'text_analysis':
        return `You've used all ${5 - remainingUsage}/5 text analyses today. Upgrade for unlimited access!`
      case 'full_results':
        return 'Upgrade to see your complete friendship analysis with unblurred insights!'
      case 'compare_friends':
        return 'Compare friends side-by-side with Pro or Premium!'
      case 'journal':
        return 'Track friendship patterns over time with our journaling tools!'
      case 'ai_simulator':
        return 'Get AI-powered "Stay or Leave" recommendations with Premium!'
      case 'circle_mapping':
        return 'Visualize your entire friend group dynamics with Premium!'
      default:
        return 'This feature requires a premium subscription!'
    }
  }

  const getIcon = () => {
    if (tier === 'free' && (feature === 'ai_simulator' || feature === 'journal')) {
      return <Crown className="w-6 h-6 text-purple-400" />
    }
    if (feature === 'circle_mapping' || feature === 'friendship_contracts') {
      return <Sparkles className="w-6 h-6 text-pink-400" />
    }
    if (remainingUsage === 0) {
      return <Clock className="w-6 h-6 text-orange-400" />
    }
    return <Lock className="w-6 h-6 text-gray-400" />
  }

  return (
    <div className="bg-gray-700/30 rounded-lg p-6 text-center border-2 border-dashed border-gray-600">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Feature Locked</h3>
      <p className="text-gray-300 mb-4 text-sm">
        {getUpgradeMessage()}
      </p>
      {showUpgrade && (
        <button
          onClick={onUpgradeClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          {tier === 'free' ? 'Start Free Trial' : 'Upgrade Now'}
        </button>
      )}
    </div>
  )
}

export default FeatureGate