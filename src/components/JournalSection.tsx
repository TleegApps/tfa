import React, { useState } from 'react';
import { FileText, Plus, Calendar, Trash2 } from 'lucide-react';
import { useAuditStorage } from '../hooks/useAuditStorage';
import { useAuth } from '../contexts/AuthContext';

interface JournalEntry {
  id: number;
  date: string;
  friend: string;
  type: 'good' | 'red-flag' | 'pattern';
  content: string;
}

const JournalSection: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    friend: '',
    type: 'good' as 'good' | 'red-flag' | 'pattern',
    content: ''
  });

  const { saveJournalEntry, isAuthenticated } = useAuditStorage();
  const { user } = useAuth();

  const addEntry = async () => {
    if (!newEntry.friend.trim() || !newEntry.content.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      friend: newEntry.friend,
      type: newEntry.type,
      content: newEntry.content
    };

    setEntries([entry, ...entries]);

    // Save to database if user is authenticated
    if (isAuthenticated) {
      await saveJournalEntry(newEntry.friend, newEntry.type, newEntry.content);
    }

    setNewEntry({ friend: '', type: 'good', content: '' });
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'good':
        return 'bg-green-500/20 text-green-400';
      case 'red-flag':
        return 'bg-red-500/20 text-red-400';
      case 'pattern':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'good':
        return 'Good Deed';
      case 'red-flag':
        return 'Red Flag';
      case 'pattern':
        return 'Pattern';
      default:
        return type;
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FileText className="w-8 h-8 mr-3 text-indigo-400" />
        <h3 className="text-2xl font-bold text-white">Friendventory Journal</h3>
      </div>
      
      <div className="space-y-6">
        {/* Add Entry Form */}
        <div className="bg-gray-700/30 rounded-lg p-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">Record a moment</h4>
          
          {!isAuthenticated && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-sm">
                Sign in to save your journal entries permanently to your account
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newEntry.friend}
              onChange={(e) => setNewEntry({ ...newEntry, friend: e.target.value })}
              placeholder="Friend's name"
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="good">Good Deed</option>
              <option value="red-flag">Red Flag</option>
              <option value="pattern">Pattern</option>
            </select>
          </div>
          
          <textarea
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            placeholder="What happened? Be specific..."
            className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          
          <button
            onClick={addEntry}
            disabled={!newEntry.friend.trim() || !newEntry.content.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Entry {isAuthenticated && '& Save'}
          </button>
        </div>
        
        {/* Entries List */}
        {entries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Start documenting your friendship moments</p>
            <p className="text-sm mt-2">Track patterns over time to make better decisions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {entry.friend.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{entry.friend}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{entry.date}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(entry.type)}`}>
                          {getTypeLabel(entry.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEntry(entry.id)}
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
    </div>
  );
};

export default JournalSection;