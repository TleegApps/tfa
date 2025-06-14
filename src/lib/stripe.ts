import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

export const stripe = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('User not authenticated')
    }

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/subscription-success`,
        cancel_url: `${window.location.origin}/pricing`
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    return data
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}