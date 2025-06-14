import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

export type SubscriptionTier = 'free' | 'trial' | 'pro' | 'premium'

interface SubscriptionContextType {
  tier: SubscriptionTier
  loading: boolean
  subscriptionStatus: string | null
  currentPeriodEnd: Date | null
  usageStats: {
    auditsThisWeek: number
    textAnalysesToday: number
    savedFriends: number
  }
  canUseFeature: (feature: string) => boolean
  getRemainingUsage: (feature: string) => number
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [loading, setLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<Date | null>(null)
  const [usageStats, setUsageStats] = useState({
    auditsThisWeek: 0,
    textAnalysesToday: 0,
    savedFriends: 0
  })

  useEffect(() => {
    if (user) {
      fetchSubscriptionData()
      fetchUsageStats()
    } else {
      setTier('free')
      setLoading(false)
    }
  }, [user])

  const fetchSubscriptionData = async () => {
    if (!user) return

    try {
      // First get the customer record
      const { data: customerData, error: customerError } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (customerError && customerError.code !== 'PGRST116') {
        console.error('Error fetching customer:', customerError)
        setLoading(false)
        return
      }

      if (!customerData) {
        setTier('free')
        setLoading(false)
        return
      }

      // Then get the subscription data
      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('customer_id', customerData.customer_id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
        setLoading(false)
        return
      }

      if (data && data.status) {
        // Map Stripe subscription status to our tier system
        const status = data.status
        setSubscriptionStatus(status)
        
        if (data.current_period_end) {
          setCurrentPeriodEnd(new Date(data.current_period_end * 1000))
        }

        // Determine tier based on price_id
        if (status === 'active' || status === 'trialing') {
          if (data.price_id === 'price_1RZhnrR5oOXaHwM4YL6YbL5I') {
            setTier('premium')
          } else if (data.price_id === 'price_1RZhmpR5oOXaHwM44zfHhNOM') {
            setTier('pro')
          } else if (data.price_id === 'price_1RZhkKR5oOXaHwM4MWvxyeFI') {
            setTier('trial')
          } else {
            setTier('free')
          }
        } else {
          setTier('free')
        }
      } else {
        setTier('free')
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      setTier('free')
    }
    
    setLoading(false)
  }

  const fetchUsageStats = async () => {
    if (!user) return

    // Get audits this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { data: audits } = await supabase
      .from('audit_results')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())

    // Get text analyses today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: analyses } = await supabase
      .from('audit_results')
      .select('id')
      .eq('user_id', user.id)
      .eq('audit_type', 'text_analysis')
      .gte('created_at', today.toISOString())

    // Get unique friends count
    const { data: friends } = await supabase
      .from('audit_results')
      .select('friend_name')
      .eq('user_id', user.id)

    const uniqueFriends = new Set(friends?.map(f => f.friend_name) || []).size

    setUsageStats({
      auditsThisWeek: audits?.length || 0,
      textAnalysesToday: analyses?.length || 0,
      savedFriends: uniqueFriends
    })
  }

  const canUseFeature = (feature: string): boolean => {
    switch (feature) {
      case 'basic_audit':
        return tier === 'free' ? usageStats.auditsThisWeek < 10 : true
      case 'text_analysis':
        return tier === 'free' ? usageStats.textAnalysesToday < 5 : true
      case 'full_results':
        return tier !== 'free'
      case 'compare_friends':
        return tier !== 'free'
      case 'journal':
        return tier !== 'free'
      case 'emotional_radar':
        return tier !== 'free'
      case 'ai_simulator':
        return tier === 'trial' || tier === 'pro' || tier === 'premium'
      case 'pattern_reports':
        return tier === 'pro' || tier === 'premium'
      case 'friendship_forecast':
        return tier === 'pro' || tier === 'premium'
      case 'red_flag_tracking':
        return tier === 'pro' || tier === 'premium'
      // New advanced features
      case 'red_flag_timeline':
        return tier === 'pro' || tier === 'premium'
      case 'drama_history_importer':
        return tier === 'pro' || tier === 'premium'
      case 'friend_group_dynamics':
        return tier === 'premium'
      case 'friendship_contracts':
        return tier === 'premium'
      case 'ghost_mode':
        return tier === 'premium'
      case 'toxicity_leaderboard':
        return tier === 'premium'
      case 'circle_mapping':
        return tier === 'premium'
      default:
        return false
    }
  }

  const getRemainingUsage = (feature: string): number => {
    switch (feature) {
      case 'basic_audit':
        return tier === 'free' ? Math.max(0, 10 - usageStats.auditsThisWeek) : -1
      case 'text_analysis':
        return tier === 'free' ? Math.max(0, 5 - usageStats.textAnalysesToday) : -1
      default:
        return -1
    }
  }

  const refreshSubscription = async () => {
    await fetchSubscriptionData()
    await fetchUsageStats()
  }

  const value = {
    tier,
    loading,
    subscriptionStatus,
    currentPeriodEnd,
    usageStats,
    canUseFeature,
    getRemainingUsage,
    refreshSubscription
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}