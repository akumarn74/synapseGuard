import React, { useState, useEffect } from 'react';
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
  HeartIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import TechnicalDashboard from '../components/TechnicalDashboard';

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState({
    stats: {
      total_patients: 0,
      cost_per_patient: 0,
      crisis_prevention_rate: 0,
      avg_response_time_minutes: 0,
      total_interventions: 0,
      total_patterns: 0
    },
    risk_stratification: {
      high_risk: 0,
      moderate_risk: 0,
      low_risk: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/dashboard-stats');
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : dashboardStats.stats.total_patients.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Real-time count</span>
                </div>
              </div>
              <UserGroupIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost per Patient</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : formatCurrency(dashboardStats.stats.cost_per_patient)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">AI optimized</span>
                </div>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crisis Prevention Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : `${dashboardStats.stats.crisis_prevention_rate}%`}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Live calculation</span>
                </div>
              </div>
              <ChartBarIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : `${dashboardStats.stats.avg_response_time_minutes}m`}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">7-day average</span>
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
                    <div className="font-bold text-red-600">
                      {loading ? '...' : `${dashboardStats.risk_stratification.high_risk} patients`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {loading ? '...' : `${((dashboardStats.risk_stratification.high_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}% of population`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Moderate Risk (Enhanced Monitoring)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">
                      {loading ? '...' : `${dashboardStats.risk_stratification.moderate_risk} patients`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {loading ? '...' : `${((dashboardStats.risk_stratification.moderate_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}% of population`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Low Risk (Standard Care)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {loading ? '...' : `${dashboardStats.risk_stratification.low_risk} patients`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {loading ? '...' : `${((dashboardStats.risk_stratification.low_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}% of population`}
                    </div>
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

        {/* Technical Deep Dive Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <CpuChipIcon className="h-8 w-8 mr-3 text-blue-600" />
              Technical Performance & ROI Analytics
            </h2>
            <p className="text-xl text-gray-600">
              Real-time TiDB performance, AI decision transparency, and quantified healthcare outcomes
            </p>
          </div>
          <TechnicalDashboard patientId="margaret_wilson" />
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-blue-600 mr-4" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Experience the Future of Healthcare AI</h2>
                <p className="text-gray-600 mt-2">See our multi-agent system coordinate care in real-time</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Production Ready</h3>
                <p className="text-sm text-gray-600">Enterprise-grade TiDB integration</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <CpuChipIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">AI Transparency</h3>
                <p className="text-sm text-gray-600">Full explainability & reasoning</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Proven ROI</h3>
                <p className="text-sm text-gray-600">Quantified healthcare savings</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/demo"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                🎬 Experience Live AI Demo
              </Link>
              <Link 
                to="/provider-preview"
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                👩‍⚕️ Provider Dashboard
              </Link>
              <Link 
                to="/"
                className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transform hover:scale-105 transition-all"
              >
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;