import React from 'react';
import { Shield, ArrowLeft, Mail, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={onBack}
            className="flex items-center text-purple-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center mb-6">
            <Shield className="w-12 h-12 mr-4 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          
          <p className="text-xl text-purple-200">
            For TheFriendAudit.com
          </p>
          <p className="text-purple-300 mt-2">
            Effective Date: January 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 space-y-8">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to TheFriendAudit.com ("we," "our," or "us"). Your privacy matters to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform to audit, analyze, and reflect on your friendships. We are committed to handling your data responsibly and in compliance with applicable privacy laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and the Children's Online Privacy Protection Act (COPPA).
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">a. Information You Provide</h3>
                <ul className="text-gray-300 space-y-1 ml-4">
                  <li>• Email address and password for account creation (passwords are securely hashed)</li>
                  <li>• Full name (optional)</li>
                  <li>• Friend names and descriptions, provided by you</li>
                  <li>• Responses to quizzes and friendship audits</li>
                  <li>• Text messages you input for red flag analysis</li>
                  <li>• Journal entries and friend comparisons stored within your account</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">b. Information Collected Automatically</h3>
                <ul className="text-gray-300 space-y-1 ml-4">
                  <li>• Analytics and device data such as browser type, operating system, and IP address</li>
                  <li>• Usage patterns and activity via cookies and Google Analytics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Collect Information</h2>
            <ul className="text-gray-300 space-y-1 ml-4">
              <li>• Through account registration forms</li>
              <li>• Through inputs you provide in quizzes, journals, analyzers, and comparison tools</li>
              <li>• Via tracking tools (e.g., Google Analytics) and cookies</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the data we collect to:
            </p>
            <ul className="text-gray-300 space-y-1 ml-4 mb-4">
              <li>• Provide core services (friendship audits, journaling, and comparison tools)</li>
              <li>• Analyze user-submitted text to detect red flags in tone or language</li>
              <li>• Enable users to revisit and reflect on historical friendship data</li>
              <li>• Improve the functionality and performance of our platform</li>
            </ul>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-200 font-medium">
                We do not use your personal data for advertising or email marketing. We do not sell or share your data with third parties.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Where and How Your Data is Stored</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your information is securely stored on our servers, hosted via Supabase. We implement strict access controls and encryption protocols:
            </p>
            <ul className="text-gray-300 space-y-1 ml-4">
              <li>• HTTPS for all data in transit</li>
              <li>• Secure password hashing</li>
              <li>• Data access limited to authorized personnel only</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use Google Analytics to gather anonymous information about how visitors interact with our site. Cookies may be stored on your device to:
            </p>
            <ul className="text-gray-300 space-y-1 ml-4 mb-4">
              <li>• Track user sessions</li>
              <li>• Store login preferences</li>
              <li>• Improve user experience</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              You may disable cookies via your browser settings or opt out of Google Analytics by visiting:{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-purple-400 hover:text-purple-300 underline">
                https://tools.google.com/dlpage/gaoptout
              </a>
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention and Deletion</h2>
            <ul className="text-gray-300 space-y-2 ml-4">
              <li>• If you delete your account, your data is immediately removed from active access and queued for deletion.</li>
              <li>• A 30-day grace period is applied in case you wish to restore your account.</li>
              <li>• After 30 days, your data is permanently deleted from our servers.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="text-gray-300 space-y-1 ml-4 mb-4">
              <li>• Access the data we hold about you</li>
              <li>• Correct inaccurate or outdated data</li>
              <li>• Download/export your friendship audit data with one click</li>
              <li>• Delete your account and associated data at any time</li>
              <li>• Restrict or object to certain types of data use</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              To exercise your rights, contact us at support@thefriendaudit.com or use the tools in your account dashboard.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              TheFriendAudit.com is not intended for children under the age of 13 without verified parental consent. If we learn that a child under 13 has registered without consent, we will promptly delete that account and associated data.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Parents or guardians can review and manage a child's data by contacting us directly.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              If you are accessing our site from outside the United States, your information may be transferred to and stored in the U.S. We apply appropriate legal safeguards, such as standard contractual clauses, to ensure your rights are protected.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy to reflect changes in law or service functionality. When we do, we will update the "Effective Date" at the top and notify users where appropriate.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, your data, or your rights, contact us at:
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-purple-300">
                <Mail className="w-5 h-5 mr-3" />
                <span>support@thefriendaudit.com</span>
              </div>
              <div className="flex items-center text-purple-300">
                <Globe className="w-5 h-5 mr-3" />
                <span>https://www.thefriendaudit.com</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back to top button */}
        <div className="text-center mt-12">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;