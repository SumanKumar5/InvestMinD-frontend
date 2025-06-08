import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, FileText, Users, Settings } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      icon: Database,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We collect only the minimal data necessary to provide our services, including:
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-300">
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm sm:text-base">
                <strong className="text-white">Account Information:</strong> Your name, email address, and encrypted password when you register.
              </div>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm sm:text-base">
                <strong className="text-white">Portfolio Data:</strong> Information you voluntarily input, such as stock symbols, quantities, and transaction history.
              </div>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm sm:text-base">
                <strong className="text-white">Usage Analytics:</strong> Anonymous usage statistics to improve user experience and platform performance.
              </div>
            </li>
          </ul>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-emerald-400 font-medium text-sm sm:text-base">
              We <strong>do not collect</strong> sensitive personal data such as bank account details, credit card numbers, or Aadhaar/PAN information.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-we-use-data',
      title: '2. How We Use Your Data',
      icon: Settings,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            Your data is used exclusively to:
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-300">
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Provide AI-powered investment analytics</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Personalize your dashboard and insights</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Improve platform performance and security</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Respond to support inquiries and feedback</span>
            </li>
          </ul>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-red-400 font-medium text-sm sm:text-base">
              We <strong>never sell, rent, or trade your data</strong> to third parties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-storage-security',
      title: '3. Data Storage & Security',
      icon: Lock,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            Your data is stored securely using industry best practices, including:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                <h4 className="font-semibold text-white text-sm sm:text-base">Encryption</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">All sensitive data is encrypted both in transit and at rest.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <h4 className="font-semibold text-white text-sm sm:text-base">Authentication</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Your account is protected using JWT-based secure login.</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <h4 className="font-semibold text-white text-sm sm:text-base">Access Control</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Only you can access your portfolio data; our team cannot view or modify it.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'third-party-services',
      title: '4. Third-Party Services',
      icon: Users,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We may use third-party services (e.g., for stock data, email delivery, or analytics) that comply with modern data protection regulations. These services are selected for their reliability and security.
          </p>
        </div>
      )
    },
    {
      id: 'cookies-tracking',
      title: '5. Cookies & Tracking',
      icon: FileText,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We use minimal cookies for authentication and performance tracking. These cookies do <strong className="text-white">not</strong> store personal financial information and are used solely to enhance your experience.
          </p>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            You can choose to disable cookies in your browser settings, although some features may not function properly as a result.
          </p>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: '6. Your Rights',
      icon: Shield,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            You have full control over your data, including:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-blue-400 mb-1 sm:mb-2 text-sm sm:text-base">Access</h4>
              <p className="text-xs sm:text-sm text-gray-300">View your personal and portfolio information at any time.</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-emerald-400 mb-1 sm:mb-2 text-sm sm:text-base">Edit</h4>
              <p className="text-xs sm:text-sm text-gray-300">Update your data through your dashboard.</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-red-400 mb-1 sm:mb-2 text-sm sm:text-base">Delete</h4>
              <p className="text-xs sm:text-sm text-gray-300">Request account deletion and permanent erasure of all associated data.</p>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-gray-300 text-sm sm:text-base">
              To request data deletion or raise privacy concerns, email us at{' '}
              <a 
                href="mailto:investmindtechapp@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium break-all"
              >
                investmindtechapp@gmail.com
              </a>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'policy-changes',
      title: '7. Changes to This Policy',
      icon: FileText,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We may update this Privacy Policy periodically to reflect platform enhancements or legal requirements. All updates will be posted on this page with the updated effective date.
          </p>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We encourage you to review this page regularly.
          </p>
        </div>
      )
    },
    {
      id: 'contact-us',
      title: '8. Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            If you have any questions about our privacy practices or need support, contact us at:
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/30 rounded-lg p-4 sm:p-6">
            <div className="flex items-start sm:items-center space-x-3">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Email</p>
                <a 
                  href="mailto:investmindtechapp@gmail.com" 
                  className="text-base sm:text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors break-all"
                >
                  investmindtechapp@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-600 rounded-full filter blur-[60px] sm:blur-[80px] animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-28 h-28 sm:w-40 sm:h-40 lg:w-60 lg:h-60 bg-purple-600 rounded-full filter blur-[60px] sm:blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-400 hover:text-white mb-4 sm:mb-6 lg:mb-8 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm sm:text-base">Back</span>
              </button>

              {/* Header */}
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 lg:mb-8">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent px-4">
                  Privacy Policy
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                  At <strong className="text-white">InvestMinD</strong>, we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you use our platform.
                </p>
                <div className="mt-4 sm:mt-6 lg:mt-8 text-xs sm:text-sm text-gray-500">
                  Last updated: January 2025
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-6 sm:py-8 lg:py-12 xl:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 sm:space-y-8 lg:space-y-12 xl:space-y-16">
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <div 
                      key={section.id}
                      id={section.id}
                      className="group bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 mb-4 sm:mb-6 lg:mb-8">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-16 lg:ml-20">
                        {section.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Closing Statement */}
              <div className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20 text-center">
                <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 lg:p-8 xl:p-10">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">
                    Built with Privacy in Mind
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                    <strong className="text-white">InvestMinD</strong> is built with your privacy and trust in mind. Thank you for choosing us to be a part of your financial journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;