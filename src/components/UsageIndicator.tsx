import React from 'react'
import { BarChart3, Clock, Zap } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

interface UsageIndicatorProps {
  feature: 'basic_audit' | 'text_analysis'
  className?: string
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ feature, className = '' }) => {
  const { tier, usageStats, getRemainingUsage } = useSubscription()

  if (tier !== 'free') {
    return null
  }

  const remaining = getRemainingUsage(feature)
  const total = feature === 'basic_audit' ? 10 : 5
  const used = total - remaining
  const percentage = (used / total) * 100

  const getColor = () => {
    if (percentage >= 90) return 'text-red-400'
    if (percentage >= 70) return 'text-orange-400'
    return 'text-green-400'
  }

  const getIcon = () => {
    if (feature === 'basic_audit') return <BarChart3 className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const getLabel = () => {
    if (feature === 'basic_audit') return 'Audits this week'
    return 'Text analyses today'
  }

  return (
    <div className={`bg-gray-700/30 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="text-sm text-gray-300">{getLabel()}</span>
        </div>
        <span className={`text-sm font-semibold ${getColor()}`}>
          {used}/{total}
        </span>
      </div>
      
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            percentage >= 90 ? 'bg-red-500' :
            percentage >= 70 ? 'bg-orange-500' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {remaining === 0 && (
        <div className="flex items-center mt-2 text-red-400 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>Limit reached - upgrade for unlimited access</span>
        </div>
      )}
    </div>
  )
}

export default UsageIndicator