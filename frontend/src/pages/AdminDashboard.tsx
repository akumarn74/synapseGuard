import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BuildingOffice2Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ArrowRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Admin Dashboard</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <BuildingOffice2Icon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health System Admin Console
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform health system operations with AI-driven population health analytics, 
            cost optimization, and resource allocation insights.
          </p>
          
          <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <span className="text-yellow-800">
              🚧 <strong>Preview Mode:</strong> This is a demonstration of the admin dashboard interface
            </span>
          </div>
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">2,847</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% this month</span>
                </div>
              </div>
              <UserGroupIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost per Patient</p>
                <p className="text-3xl font-bold text-gray-900">$2,340</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-8% reduction</span>
                </div>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crisis Prevention Rate</p>
                <p className="text-3xl font-bold text-gray-900">94.2%</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+18% improvement</span>
                </div>
              </div>
              <ChartBarIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900">14m</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-45% faster</span>
                </div>
              </div>
              <ClockIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Population Health Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Population Health Insights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Stratification</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">High Risk (Crisis Prevention)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">127 patients</div>
                    <div className="text-sm text-gray-600">4.5% of population</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Moderate Risk (Enhanced Monitoring)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">542 patients</div>
                    <div className="text-sm text-gray-600">19.0% of population</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Low Risk (Standard Care)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">2,178 patients</div>
                    <div className="text-sm text-gray-600">76.5% of population</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Optimization Opportunities</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Predictive Staffing</span>
                    <span className="text-sm font-bold text-blue-600">$340K savings/year</span>
                  </div>
                  <p className="text-sm text-gray-600">AI predicts peak demand 72 hours ahead, optimizing staff allocation</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-800">Early Intervention</span>
                    <span className="text-sm font-bold text-purple-600">$1.2M savings/year</span>
                  </div>
                  <p className="text-sm text-gray-600">Crisis prevention reduces emergency interventions by 67%</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Care Coordination</span>
                    <span className="text-sm font-bold text-green-600">$580K savings/year</span>
                  </div>
                  <p className="text-sm text-gray-600">Automated workflows reduce administrative overhead by 40%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Operations Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-time Operations Monitor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Active Alerts</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High-risk patients</span>
                    <span className="font-bold">3</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Care team notifications</span>
                    <span className="font-bold">18</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Family communications</span>
                    <span className="font-bold">42</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">System Performance</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI processing speed</span>
                    <span className="font-bold">2.3s avg</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database queries</span>
                    <span className="font-bold">99.8% uptime</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TiDB performance</span>
                    <span className="font-bold">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Patient satisfaction</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Provider engagement</span>
                    <span className="font-bold">96%</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Family portal usage</span>
                    <span className="font-bold">89%</span>
                  </div>
                </div>
              </div>
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
          <h2 className="text-2xl font-bold mb-6">Complete Care Ecosystem</h2>
          <p className="text-lg mb-8 opacity-90">
            See how administrative insights connect with clinical operations and family engagement
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300">Clinical Integration</h3>
              <p className="text-sm opacity-90 mb-4">
                Provider dashboards feed into population health analytics, creating a continuous 
                improvement loop for clinical decision-making and resource allocation.
              </p>
              <Link 
                to="/provider-preview"
                className="inline-flex items-center text-blue-300 hover:text-blue-200"
              >
                View Provider Dashboard <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-pink-300">Family Engagement Impact</h3>
              <p className="text-sm opacity-90 mb-4">
                Family portal usage data and satisfaction metrics directly contribute to 
                operational efficiency and quality improvement initiatives.
              </p>
              <Link 
                to="/family-preview"
                className="inline-flex items-center text-pink-300 hover:text-pink-200"
              >
                View Family Experience <ArrowRightIcon className="h-4 w-4 ml-2" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">See the Technology in Action</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/demo"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Experience Live AI Demo
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

export default AdminDashboard;