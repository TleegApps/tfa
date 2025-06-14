import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export const useAuditStorage = () => {
  const { user } = useAuth()

  const saveAuditResult = async (
    friendName: string,
    auditType: 'quiz' | 'text_analysis' | 'comparison',
    results: any
  ) => {
    if (!user) return { error: 'User not authenticated' }

    const { error } = await supabase
      .from('audit_results')
      .insert({
        user_id: user.id,
        friend_name: friendName,
        audit_type: auditType,
        results: results
      })

    return { error }
  }

  const saveJournalEntry = async (
    friendName: string,
    entryType: 'good' | 'red-flag' | 'pattern',
    content: string
  ) => {
    if (!user) return { error: 'User not authenticated' }

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        friend_name: friendName,
        entry_type: entryType,
        content: content
      })

    return { error }
  }

  return {
    saveAuditResult,
    saveJournalEntry,
    isAuthenticated: !!user
  }
}