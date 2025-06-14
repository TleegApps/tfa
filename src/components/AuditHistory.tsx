import React, { useState, useEffect } from 'react'
import { History, Calendar, User, MessageSquare, Users, FileText, Trash2, Eye, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface AuditResult {
  id: string
  friend_name: string
  audit_type: 'quiz' | 'text_analysis' | 'comparison'
  results: any
  created_at: string
}

interface JournalEntry {
  id: string
  friend_name: string
  entry_type: 'good' | 'red-flag' | 'pattern'
  content: string
  created_at: string
}

const AuditHistory: React.FC = () => {
  const { user } = useAuth()
  const [auditResults, setAuditResults] = useState<AuditResult[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'audits' | 'journal'>('audits')
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null)

  useEffect(() => {
    if (user) {
      fetchAuditHistory()
      fetchJournalEntries()
    }
  }, [user])

  const fetchAuditHistory = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('audit_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching audit history:', error)
    } else {
      setAuditResults(data || [])
    }
    setLoading(false)
  }

  const fetchJournalEntries = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching journal entries:', error)
    } else {
      setJournalEntries(data || [])
    }
  }

  const deleteAuditResult = async (id: string) => {
    const { error } = await supabase
      .from('audit_results')
      .delete()
      .eq('id', id)

    if (!error) {
      setAuditResults(auditResults.filter(result => result.id !== id))
    }
  }

  const deleteJournalEntry = async (id: string) => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (!error) {
      setJournalEntries(journalEntries.filter(entry => entry.id !== id))
    }
  }

  const getAuditTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <User className="w-5 h-5" />
      case 'text_analysis':
        return <MessageSquare className="w-5 h-5" />
      case 'comparison':
        return <Users className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getAuditTypeName = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'Friendship Quiz'
      case 'text_analysis':
        return 'Text Analysis'
      case 'comparison':
        return 'Friend Comparison'
      default:
        return 'Unknown'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case 'rock solid':
        return 'text-green-400'
      case 'surface level safe':
        return 'text-yellow-400'
      case 'emotional vampire':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case 'good':
        return 'bg-green-500/20 text-green-400'
      case 'red-flag':
        return 'bg-red-500/20 text-red-400'
      case 'pattern':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your audit history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <History className="w-12 h-12 mr-4 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Audit History
            </h1>
          </div>
          <p className="text-xl text-purple-200">
            Your friendship audit journey so far
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-2 border border-purple-500/20">
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === 'audits'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Audit Results ({auditResults.length})
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Journal Entries ({journalEntries.length})
            </button>
          </div>
        </div>

        {/* Audit Results Tab */}
        {activeTab === 'audits' && (
          <div className="space-y-6">
            {auditResults.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400 text-lg">No audit results yet</p>
                <p className="text-gray-500 mt-2">Start auditing your friendships to see results here</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {auditResults.map((result) => (
                  <div key={result.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {result.friend_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{result.friend_name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            {getAuditTypeIcon(result.audit_type)}
                            <span>{getAuditTypeName(result.audit_type)}</span>
                            <Calendar className="w-4 h-4 ml-2" />
                            <span>{new Date(result.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedResult(result)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteAuditResult(result.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {result.audit_type === 'quiz' && result.results.grade && (
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-bold ${getGradeColor(result.results.grade)}`}>
                          {result.results.grade}
                        </span>
                        <span className="text-gray-300">
                          {result.results.percentage?.toFixed(0)}% • {result.results.score}/30
                        </span>
                      </div>
                    )}
                    
                    {result.audit_type === 'text_analysis' && result.results.verdict && (
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-bold ${getGradeColor(result.results.verdict)}`}>
                          {result.results.verdict}
                        </span>
                        <span className="text-gray-300">
                          {result.results.overallScore}% overall score
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Journal Entries Tab */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            {journalEntries.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400 text-lg">No journal entries yet</p>
                <p className="text-gray-500 mt-2">Start documenting friendship moments to see entries here</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {entry.friend_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{entry.friend_name}</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getEntryTypeColor(entry.entry_type)}`}>
                              {entry.entry_type === 'good' ? 'Good Deed' : 
                               entry.entry_type === 'red-flag' ? 'Red Flag' : 'Pattern'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl border border-purple-500/20 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedResult.friend_name} - Detailed Results</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedResult.results, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditHistory