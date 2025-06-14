import React, { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  score: number;
  grade: string;
  color: string;
}

const CompareSection: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendName, setNewFriendName] = useState('');

  const addFriend = () => {
    if (!newFriendName.trim()) return;
    
    // Simulate a random audit score for demo
    const score = Math.floor(Math.random() * 30) + 1;
    const percentage = (score / 30) * 100;
    
    let grade, color;
    if (percentage >= 75) {
      grade = "Rock Solid";
      color = "green";
    } else if (percentage >= 50) {
      grade = "Surface Level";
      color = "yellow";
    } else {
      grade = "Toxic";
      color = "red";
    }

    const newFriend: Friend = {
      id: Date.now(),
      name: newFriendName,
      score,
      grade,
      color
    };

    setFriends([...friends, newFriend]);
    setNewFriendName('');
  };

  const removeFriend = (id: number) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 mr-3 text-purple-400" />
        <h3 className="text-2xl font-bold text-white">Compare Friends</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Friend's name (or nickname)"
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && addFriend()}
          />
          <button
            onClick={addFriend}
            disabled={!newFriendName.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {friends.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Add friends to compare their friendship scores</p>
            <p className="text-sm mt-2">This is a demo - real scores would come from actual audits</p>
          </div>
        ) : (
          <div className="space-y-4">
            {friends.map((friend) => (
              <div key={friend.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{friend.name}</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm px-2 py-1 rounded ${
                        friend.color === 'green' ? 'bg-green-500/20 text-green-400' :
                        friend.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {friend.grade}
                      </span>
                      <span className="text-gray-300 text-sm">{friend.score}/30</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {friends.length > 1 && (
              <div className="bg-gray-700/30 rounded-lg p-4 mt-6">
                <h4 className="text-white font-semibold mb-3">Quick Insights</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• Best friend: {friends.reduce((a, b) => a.score > b.score ? a : b).name}</p>
                  <p>• Most concerning: {friends.reduce((a, b) => a.score < b.score ? a : b).name}</p>
                  <p>• Average score: {(friends.reduce((sum, f) => sum + f.score, 0) / friends.length).toFixed(1)}/30</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareSection;