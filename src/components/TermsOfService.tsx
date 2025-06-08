import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User, Shield, AlertTriangle, Scale, Globe, Mail, CheckCircle, XCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'acceptance-of-terms',
      title: '1. Acceptance of Terms',
      icon: CheckCircle,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            By creating an account or using any part of the InvestMinD platform, you acknowledge that you have read, understood, and agree to be legally bound by these terms. If you do not agree, please do not use the platform.
          </p>
        </div>
      )
    },
    {
      id: 'description-of-service',
      title: '2. Description of Service',
      icon: FileText,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            <strong className="text-white">InvestMinD</strong> is an AI-powered investment analytics platform that helps users manage their stock portfolios by offering data-driven insights, performance tracking, and visual dashboards.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Important Notice</p>
                <p className="text-gray-300 text-xs sm:text-sm">
                  It is intended for <strong className="text-white">informational and personal use only</strong>, and <strong className="text-white">does not provide financial or investment advice</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-responsibilities',
      title: '3. User Responsibilities',
      icon: User,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            As a user, you agree to:
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-300">
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Provide accurate and up-to-date information when creating your account or managing portfolios.</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Use the platform for lawful and personal purposes only.</span>
            </li>
            <li className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base">Maintain the confidentiality of your login credentials and take full responsibility for any activity under your account.</span>
            </li>
          </ul>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-blue-400 font-medium text-sm sm:text-base">
              You must be at least <strong>18 years old</strong> or the age of majority in your jurisdiction to use this service.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-privacy',
      title: '4. Data & Privacy',
      icon: Shield,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            Your use of the platform is subject to our{' '}
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline decoration-blue-400/50 hover:decoration-blue-300/50"
            >
              Privacy Policy
            </button>
            , which outlines how we collect, use, and protect your data. By using InvestMinD, you consent to the collection and processing of your information as described.
          </p>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property',
      icon: FileText,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            All content, branding, UI/UX designs, and underlying source code on InvestMinD are the intellectual property of the platform and its developers. You agree not to copy, reproduce, modify, or distribute any part of the platform without express written permission.
          </p>
        </div>
      )
    },
    {
      id: 'ai-market-data-disclaimer',
      title: '6. AI & Market Data Disclaimer',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-400 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Informational Purpose Only</p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    All AI-generated insights, charts, and analytics are <strong className="text-white">for informational purposes only</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium mb-1 sm:mb-2 text-sm sm:text-base">No Guarantees</p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    We do <strong className="text-white">not guarantee the accuracy, completeness, or timeliness</strong> of any market data.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Limitation of Responsibility</p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    <strong className="text-white">InvestMinD is not responsible</strong> for financial losses or decisions made based on platform data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'limitation-of-liability',
      title: '7. Limitation of Liability',
      icon: Shield,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 sm:p-6">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              To the fullest extent permitted by law, InvestMinD shall not be liable for any direct, indirect, incidental, or consequential damages arising out of your use or inability to use the platform — including, but not limited to, data loss, financial loss, or missed investment opportunities.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: '8. Termination',
      icon: XCircle,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-red-400 mb-1 sm:mb-2 text-sm sm:text-base">Platform Rights</h4>
              <p className="text-xs sm:text-sm text-gray-300">
                We reserve the right to suspend or terminate your access to the platform at any time, with or without notice, if we believe you have violated these terms or engaged in misuse of the service.
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-blue-400 mb-1 sm:mb-2 text-sm sm:text-base">User Rights</h4>
              <p className="text-xs sm:text-sm text-gray-300">
                You may terminate your account at any time via your dashboard or by contacting support.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'changes-to-terms',
      title: '9. Changes to Terms',
      icon: FileText,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            We may modify these Terms of Service from time to time. When we do, we'll update the "Effective Date" at the top of this page. Your continued use of the platform after changes signifies acceptance of the revised terms.
          </p>
        </div>
      )
    },
    {
      id: 'governing-law',
      title: '10. Governing Law',
      icon: Scale,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Jurisdiction</h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  These terms shall be governed by and construed in accordance with the laws of the <strong className="text-white">Republic of India</strong>. Any disputes arising shall be resolved under the jurisdiction of the courts of <strong className="text-white">Bangalore, Karnataka</strong>, unless otherwise specified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact-us',
      title: '11. Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            If you have any questions or concerns regarding these terms, please contact us at:
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
                  <Scale className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent px-4">
                  Terms of Service
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                  Welcome to <strong className="text-white">InvestMinD</strong>. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before proceeding.
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
                    Smart Investing Begins Here
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                    <strong className="text-white">Thank you for using InvestMinD</strong> — where smarter investing begins with smarter insights.
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

export default TermsOfService;