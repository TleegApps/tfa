import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, User } from 'lucide-react';
import { useAuditStorage } from '../hooks/useAuditStorage';
import { useAuth } from '../contexts/AuthContext';

interface QuizSectionProps {
  onComplete: (results: any) => void;
}

const questions = [
  {
    id: 1,
    question: "When you share good news, how do they react?",
    options: [
      { text: "Genuinely excited and supportive", score: 3 },
      { text: "Happy but quickly changes subject", score: 2 },
      { text: "Seems uncomfortable or competitive", score: 1 },
      { text: "Makes it about themselves", score: 0 }
    ]
  },
  {
    id: 2,
    question: "How often do they reach out to you?",
    options: [
      { text: "Regularly, just to check in", score: 3 },
      { text: "Occasionally, for casual chats", score: 2 },
      { text: "Rarely, unless they need something", score: 1 },
      { text: "Only when they want something", score: 0 }
    ]
  },
  {
    id: 3,
    question: "When you're going through a tough time, they:",
    options: [
      { text: "Drop everything to support you", score: 3 },
      { text: "Listen and offer helpful advice", score: 2 },
      { text: "Listen but seem distracted", score: 1 },
      { text: "Make it about their problems", score: 0 }
    ]
  },
  {
    id: 4,
    question: "How do you feel after spending time with them?",
    options: [
      { text: "Energized and happy", score: 3 },
      { text: "Content and relaxed", score: 2 },
      { text: "Neutral or sometimes drained", score: 1 },
      { text: "Exhausted or stressed", score: 0 }
    ]
  },
  {
    id: 5,
    question: "They remember important things about your life:",
    options: [
      { text: "Always, and follow up on them", score: 3 },
      { text: "Usually, when reminded", score: 2 },
      { text: "Sometimes, if it's really important", score: 1 },
      { text: "Rarely or never", score: 0 }
    ]
  },
  {
    id: 6,
    question: "When you set boundaries, they:",
    options: [
      { text: "Respect them completely", score: 3 },
      { text: "Mostly respect them", score: 2 },
      { text: "Push back but eventually accept", score: 1 },
      { text: "Ignore or violate them", score: 0 }
    ]
  },
  {
    id: 7,
    question: "In group settings, they:",
    options: [
      { text: "Include you and value your input", score: 3 },
      { text: "Are friendly and normal", score: 2 },
      { text: "Sometimes ignore or dismiss you", score: 1 },
      { text: "Put you down or compete with you", score: 0 }
    ]
  },
  {
    id: 8,
    question: "They keep your secrets:",
    options: [
      { text: "Always, I trust them completely", score: 3 },
      { text: "Usually, with minor slip-ups", score: 2 },
      { text: "Sometimes, depending on the secret", score: 1 },
      { text: "Rarely, they love to gossip", score: 0 }
    ]
  },
  {
    id: 9,
    question: "When you disagree about something:",
    options: [
      { text: "We discuss it respectfully", score: 3 },
      { text: "We agree to disagree", score: 2 },
      { text: "It gets a bit tense but resolves", score: 1 },
      { text: "They get defensive or mean", score: 0 }
    ]
  },
  {
    id: 10,
    question: "Overall, this friendship feels:",
    options: [
      { text: "Balanced and mutually supportive", score: 3 },
      { text: "Generally positive with minor issues", score: 2 },
      { text: "One-sided or inconsistent", score: 1 },
      { text: "Draining and stressful", score: 0 }
    ]
  }
];

const QuizSection: React.FC<QuizSectionProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [friendName, setFriendName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  
  const { saveAuditResult, isAuthenticated } = useAuditStorage();
  const { user } = useAuth();

  const handleAnswer = (score: number) => {
    setSelectedOption(score);
  };

  const startQuiz = () => {
    if (friendName.trim()) {
      setShowNameInput(false);
    }
  };

  const nextQuestion = async () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate results
        const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
        const maxScore = questions.length * 3;
        const percentage = (totalScore / maxScore) * 100;
        
        let grade, color, description;
        if (percentage >= 75) {
          grade = "Rock Solid";
          color = "green";
          description = "This friendship is genuine gold. They're supportive, trustworthy, and bring positive energy to your life. Keep them close and treasure this connection.";
        } else if (percentage >= 50) {
          grade = "Surface Level Safe";
          color = "yellow";
          description = "This friend is decent but not your inner circle material. They're fine for casual hangouts, but don't expect deep emotional support or complete reliability.";
        } else {
          grade = "Emotional Vampire";
          color = "red";
          description = "Houston, we have a problem. This friendship is draining your energy and potentially toxic. Consider setting boundaries or gradually distancing yourself.";
        }

        const results = {
          score: totalScore,
          percentage,
          grade,
          color,
          description,
          redFlags: newAnswers.filter(score => score <= 1).length,
          answers: newAnswers,
          friendName
        };

        // Save to database if user is authenticated
        if (isAuthenticated && friendName.trim()) {
          await saveAuditResult(friendName, 'quiz', results);
        }

        onComplete(results);
        
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.getElementById('results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showNameInput) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            The Friendship Audit
          </h2>
          <p className="text-xl text-purple-200">
            Let's start by telling us who we're auditing
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Who are we auditing today?
            </h3>
            <p className="text-gray-300 mb-6">
              Enter their name or nickname. {isAuthenticated ? 'This will be saved to your audit history.' : 'Sign in to save your audit history.'}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Friend's name or nickname"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 mb-6"
              onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
            />
            
            <button
              onClick={startQuiz}
              disabled={!friendName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start the Audit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Auditing: {friendName}
        </h2>
        <p className="text-xl text-purple-200">
          Answer honestly. The algorithm doesn't lie.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-purple-300 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 mb-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          {questions[currentQuestion].question}
        </h3>
        
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.score)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                selectedOption === option.score
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        <button
          onClick={nextQuestion}
          disabled={selectedOption === null}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuizSection;