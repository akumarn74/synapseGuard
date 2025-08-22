import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Stakeholder {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  features: string[];
  link: string;
  color: string;
}

const LandingPage: React.FC = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  const stakeholders: Stakeholder[] = [
    {
      title: 'Family Portal',
      icon: HeartIcon,
      description: 'Real-time monitoring, instant alerts, and care coordination for families',
      features: ['24/7 Patient Monitoring', 'Instant Crisis Alerts', 'Care Team Communication', 'Progress Tracking'],
      link: '/family-preview',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Healthcare Provider',
      icon: UserGroupIcon,
      description: 'Clinical decision support with AI-powered insights and patient analytics',
      features: ['Clinical Decision Support', 'Predictive Analytics', 'Patient Risk Scoring', 'Care Plan Optimization'],
      link: '/provider-preview',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Health System Admin',
      icon: BuildingOffice2Icon,
      description: 'Enterprise analytics, cost optimization, and population health management',
      features: ['Population Health Analytics', 'Cost Optimization', 'Resource Allocation', 'Outcome Metrics'],
      link: '/admin-preview',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              🧠 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SynapseGuard</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              The World's First AI-Powered Neurodegenerative Care Orchestrator
            </p>
            <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
              Transforming reactive healthcare into predictive care through multi-agent AI coordination, 
              preventing crises 3-7 days before they happen
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/demo"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                🎬 Live Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">👋 Who are you?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to see what SynapseGuard can do for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/family-preview"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <HeartIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">I'm a Family Member</h3>
                <p className="text-gray-600 text-sm">Monitor and coordinate care for my loved one</p>
              </div>
            </Link>

            <Link 
              to="/provider-preview"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">I'm a Healthcare Provider</h3>
                <p className="text-gray-600 text-sm">Get AI-powered clinical insights and decision support</p>
              </div>
            </Link>

            <Link 
              to="/admin-preview"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BuildingOffice2Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">I'm a Health System Admin</h3>
                <p className="text-gray-600 text-sm">Optimize operations and manage population health</p>
              </div>
            </Link>

            <Link 
              to="/demo"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ChartPieIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">I'm Evaluating This</h3>
                <p className="text-gray-600 text-sm">See the live AI demo and technical details</p>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <span className="text-yellow-800 text-sm">
                💡 <strong>New here?</strong> Try the <Link to="/demo" className="text-blue-600 underline">Live Demo</Link> to see our AI in action
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Portals */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multi-Stakeholder Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for every stakeholder in the neurodegenerative care ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`h-2 bg-gradient-to-r ${stakeholder.color}`}></div>
                  
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stakeholder.color} shadow-lg`}>
                        <stakeholder.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 ml-4">{stakeholder.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-lg">{stakeholder.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {stakeholder.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to={stakeholder.link}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${stakeholder.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      Enter Portal
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Innovation */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Revolutionary Technology</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multi-agent AI coordination powered by TiDB Serverless vector and full-text search
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">AI Agent Architecture</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-900/30 rounded-xl">
                    <ChartBarIcon className="h-8 w-8 text-blue-400 mr-4" />
                    <div>
                      <div className="text-white font-semibold">Cognitive Analyzer</div>
                      <div className="text-gray-300">Pattern analysis & deviation detection</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-orange-900/30 rounded-xl">
                    <ChartPieIcon className="h-8 w-8 text-orange-400 mr-4" />
                    <div>
                      <div className="text-white font-semibold">Crisis Prevention</div>
                      <div className="text-gray-300">Risk assessment & medical literature search</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-900/30 rounded-xl">
                    <UserGroupIcon className="h-8 w-8 text-green-400 mr-4" />
                    <div>
                      <div className="text-white font-semibold">Care Orchestration</div>
                      <div className="text-gray-300">Automated family & provider coordination</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">TiDB Integration</h4>
                <div className="font-mono text-sm text-green-400 space-y-2">
                  <div>📊 Vector Search: Behavioral Pattern Matching</div>
                  <div>🔍 Full-text Search: Medical Literature</div>
                  <div>🔄 Real-time Processing: Multi-agent Coordination</div>
                  <div>📈 Predictive Analytics: 3-7 Day Crisis Window</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Experience the future of AI-powered neurodegenerative care
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/demo"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              🎬 Experience Live Demo
            </Link>
      
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;