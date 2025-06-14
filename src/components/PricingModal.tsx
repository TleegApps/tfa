import React, { useState } from 'react'
import { X, Check, Crown, Zap, Star, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { STRIPE_PRODUCTS } from '../stripe-config'
import { createCheckoutSession, stripe } from '../lib/stripe'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  highlightPlan?: 'pro' | 'premium'
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, highlightPlan = 'pro' }) => {
  const { user } = useAuth()
  const { tier } = useSubscription()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (productKey: keyof typeof STRIPE_PRODUCTS) => {
    if (!user || !stripe) {
      alert('Please sign in to subscribe')
      return
    }

    setLoading(productKey)
    
    try {
      const product = STRIPE_PRODUCTS[productKey]
      const session = await createCheckoutSession(product.priceId, product.mode)
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId
      })

      if (result.error) {
        console.error('Stripe error:', result.error)
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  if (!isOpen) return null

  const plans = [
    {
      key: 'free' as const,
      name: 'Free Tier',
      price: 0,
      interval: 'forever',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-gray-600 to-gray-700',
      features: [
        '10 basic audits per week',
        'Red Flag Decoder (5 uses/day)',
        'Partial results (blurred insights)',
        'Energy Drain Index (no breakdowns)',
        'Limited Compare Friends tool'
      ],
      limitations: [
        'No full emotional radar',
        'No journaling tools',
        'No AI simulator',
        'No pattern tracking'
      ],
      current: tier === 'free'
    },
    {
      key: 'trial' as const,
      name: '3-Day Premium Trial',
      price: STRIPE_PRODUCTS.trial.price,
      interval: '3 days',
      icon: <Star className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      features: STRIPE_PRODUCTS.trial.description.split('    ').map(f => f.trim()),
      cta: 'Start Trial',
      current: tier === 'trial'
    },
    {
      key: 'pro' as const,
      name: 'Pro Tier',
      price: STRIPE_PRODUCTS.pro.price,
      interval: 'month',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600',
      popular: highlightPlan === 'pro',
      features: STRIPE_PRODUCTS.pro.description.split('    ').map(f => f.trim()),
      current: tier === 'pro'
    },
    {
      key: 'premium' as const,
      name: 'Premium Tier',
      price: STRIPE_PRODUCTS.premium.price,
      interval: 'month',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      popular: highlightPlan === 'premium',
      features: STRIPE_PRODUCTS.premium.description.split('    ').map(f => f.trim()),
      current: tier === 'premium'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-6xl border border-purple-500/20 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choose Your Plan
              </h2>
              <p className="text-gray-300 mt-2">Unlock the full power of friendship auditing</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`relative bg-gray-700/50 rounded-2xl p-6 border ${
                  plan.popular ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-600'
                } ${plan.current ? 'ring-2 ring-green-500/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      CURRENT
                    </span>
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-4`}>
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.interval}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <ul className="space-y-1 mb-6">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start text-sm text-red-400">
                        <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                )}

                {!plan.current && (
                  <button
                    onClick={() => {
                      if (plan.key !== 'free') {
                        handleSubscribe(plan.key)
                      }
                    }}
                    disabled={loading === plan.key || plan.key === 'free'}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      plan.key === 'free'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === plan.key
                      ? 'Processing...'
                      : plan.key === 'free'
                      ? 'Current Plan'
                      : plan.cta || 'Subscribe'
                    }
                  </button>
                )}

                {plan.current && (
                  <div className="w-full py-3 rounded-lg bg-green-500/20 text-green-400 text-center font-semibold">
                    Current Plan
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>All plans include secure data storage and privacy protection.</p>
            <p className="mt-1">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingModal