import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  HeartIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

const ProviderDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Provider Dashboard</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <UserGroupIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Healthcare Provider Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience AI-powered clinical decision support with predictive analytics, 
            patient risk scoring, and evidence-based care recommendations.
          </p>
          
          <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <span className="text-yellow-800">
              🚧 <strong>Preview Mode:</strong> This is a demonstration of the provider dashboard interface
            </span>
          </div>
        </motion.div>

        {/* Patient Risk Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Patient Risk Assessment</h2>
            <div className="text-sm text-gray-500">Updated 5 minutes ago</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Risk Patients</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                  <p className="text-sm text-red-600">Require immediate attention</p>
                </div>
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moderate Risk</p>
                  <p className="text-3xl font-bold text-yellow-600">8</p>
                  <p className="text-sm text-yellow-600">Enhanced monitoring</p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stable Patients</p>
                  <p className="text-3xl font-bold text-green-600">24</p>
                  <p className="text-sm text-green-600">Standard care protocol</p>
                </div>
                <HeartIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Clinical Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Clinical Decision Support</h2>
          
          {/* High Priority Patient */}
          <div className="border-l-4 border-red-500 bg-red-50 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Margaret Wilson, 72</h3>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">HIGH RISK</span>
                </div>
                <p className="text-gray-700 mb-4">
                  <strong>AI Alert:</strong> Deviation score 0.72 - pattern anomalies detected in sleep and cognitive metrics. 
                  Vector similarity search indicates 85% match with pre-crisis patterns from historical data.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Schedule cognitive assessment within 48h</li>
                      <li>• Review sleep medications</li>
                      <li>• Increase family communication frequency</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Supporting Evidence</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Sleep fragmentation increased 40%</li>
                      <li>• Cognitive test scores declining</li>
                      <li>• Social interaction reduced</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    to="/patient"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    View Patient App
                  </Link>
                  <Link
                    to="/family-preview"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700"
                  >
                    Family Portal
                  </Link>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">
                    Update Care Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Moderate Risk Patient */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Robert Chen, 68</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">MODERATE RISK</span>
                </div>
                <p className="text-gray-700 mb-4">
                  <strong>AI Insight:</strong> Gradual cognitive pattern changes detected. Recommend enhanced monitoring 
                  and preventive interventions. Machine learning model suggests 65% probability of progression.
                </p>
                
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    View Full Analysis
                  </button>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">
                    Schedule Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clinical Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinical Decision Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
              <BeakerIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Risk Calculator</p>
              <p className="text-xs text-center mt-2 opacity-90">AI-powered progression prediction</p>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
              <DocumentTextIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Literature Search</p>
              <p className="text-xs text-center mt-2 opacity-90">10,000+ research papers</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
              <ClipboardDocumentCheckIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Care Protocols</p>
              <p className="text-xs text-center mt-2 opacity-90">Evidence-based guidelines</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
              <ChartBarIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Analytics Dashboard</p>
              <p className="text-xs text-center mt-2 opacity-90">Population insights</p>
            </div>
          </div>
        </motion.div>

        {/* Connection to Other Stakeholders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Coordinated Care Network</h2>
          <p className="text-lg mb-8 opacity-90">
            See how your clinical insights connect with families and health system operations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-pink-300">Family Portal Integration</h3>
              <p className="text-sm opacity-90 mb-4">
                Families receive AI-generated updates while maintaining clinical privacy. 
                Automated communication optimizes engagement strategies.
              </p>
              <Link 
                to="/family-preview"
                className="inline-flex items-center text-pink-300 hover:text-pink-200"
              >
                View Family Experience <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-300">Health System Analytics</h3>
              <p className="text-sm opacity-90 mb-4">
                Your clinical decisions contribute to population health insights and 
                resource optimization at the health system level.
              </p>
              <Link 
                to="/admin-preview"
                className="inline-flex items-center text-green-300 hover:text-green-200"
              >
                View System Dashboard <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience the AI in Action</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/demo"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              See Live AI Demo
            </Link>
            <Link 
              to="/"
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transform hover:scale-105 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderDashboard;