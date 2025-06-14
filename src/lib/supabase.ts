import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      audit_results: {
        Row: {
          id: string
          user_id: string
          friend_name: string
          audit_type: 'quiz' | 'text_analysis' | 'comparison'
          results: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_name: string
          audit_type: 'quiz' | 'text_analysis' | 'comparison'
          results: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_name?: string
          audit_type?: 'quiz' | 'text_analysis' | 'comparison'
          results?: any
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          friend_name: string
          entry_type: 'good' | 'red-flag' | 'pattern'
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_name: string
          entry_type: 'good' | 'red-flag' | 'pattern'
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_name?: string
          entry_type?: 'good' | 'red-flag' | 'pattern'
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}