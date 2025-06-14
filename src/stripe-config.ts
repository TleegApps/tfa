export const STRIPE_PRODUCTS = {
  'premium': {
    priceId: 'price_1RZhnrR5oOXaHwM4YL6YbL5I',
    name: 'TheFriendAudit - Premium',
    description: 'Everything in Pro    Friendship Circle Mapping (group dynamics visualization)    Drama History Importer (WhatsApp/iMessage analysis)    Friend Group Dynamics Map    Friendship Contracts generator    Ghost Mode (strategic exit planning)    Toxicity Leaderboard (global insights)    Early access to new AI tools    VIP support & beta features',
    mode: 'subscription' as const,
    price: 14.99
  },
  'pro': {
    priceId: 'price_1RZhmpR5oOXaHwM44zfHhNOM',
    name: 'TheFriendAudit - Pro',
    description: 'Everything in Trial    Save & compare up to 30 friends    Red Flag Timeline (pattern tracking)    Emotional pattern reports over time    Monthly relationship forecast    Red flag auto-tracking via message input    Advanced analytics dashboard    Priority support',
    mode: 'subscription' as const,
    price: 9.99
  },
  'trial': {
    priceId: 'price_1RZhkKR5oOXaHwM4MWvxyeFI',
    name: '3-Day Premium Trial',
    description: 'Unlimited audits    Full toxic text analyzer with complete feedback    "Stay or Leave" AI simulator    Complete journaling tools    Unblurred emotional radar    Friend comparison tools    All basic premium features',
    mode: 'subscription' as const,
    price: 6.99
  }
} as const;

export type ProductKey = keyof typeof STRIPE_PRODUCTS;