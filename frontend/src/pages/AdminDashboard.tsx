import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
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
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/admin/dashboard-stats`);
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback data for demo
      setDashboardStats({
        stats: {
          total_patients: 847,
          cost_per_patient: 12750,
          crisis_prevention_rate: 94,
          avg_response_time_minutes: 3.2,
          total_interventions: 2156,
          total_patterns: 8394
        },
        risk_stratification: {
          high_risk: 23,
          moderate_risk: 89,
          low_risk: 735
        }
      });
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">System Administration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <BuildingOffice2Icon className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Health System Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Population health analytics and operational insights
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <UserGroupIcon className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : dashboardStats.stats.total_patients.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500">+12% this quarter</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-medium text-gray-600">Cost per Patient</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : formatCurrency(dashboardStats.stats.cost_per_patient)}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500">-8% vs baseline</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <ShieldCheckIcon className="h-4 w-4 text-purple-500" />
                    <p className="text-sm font-medium text-gray-600">Prevention Rate</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : `${dashboardStats.stats.crisis_prevention_rate}%`}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500">Target: 92%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <ClockIcon className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : `${dashboardStats.stats.avg_response_time_minutes}m`}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500">SLA: &lt;5m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Population Health Analytics */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Population Health Analytics</h2>
              <p className="text-sm text-gray-600 mt-1">AI-powered insights and risk stratification</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">High Risk</p>
                          <p className="text-xs text-gray-500">Crisis prevention required</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-red-600">
                          {loading ? '...' : dashboardStats.risk_stratification.high_risk}
                        </div>
                        <div className="text-xs text-gray-500">
                          {loading ? '...' : `${((dashboardStats.risk_stratification.high_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}%`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Moderate Risk</p>
                          <p className="text-xs text-gray-500">Enhanced monitoring</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-amber-600">
                          {loading ? '...' : dashboardStats.risk_stratification.moderate_risk}
                        </div>
                        <div className="text-xs text-gray-500">
                          {loading ? '...' : `${((dashboardStats.risk_stratification.moderate_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}%`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Low Risk</p>
                          <p className="text-xs text-gray-500">Standard care protocol</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-emerald-600">
                          {loading ? '...' : dashboardStats.risk_stratification.low_risk}
                        </div>
                        <div className="text-xs text-gray-500">
                          {loading ? '...' : `${((dashboardStats.risk_stratification.low_risk / Math.max(dashboardStats.stats.total_patients, 1)) * 100).toFixed(1)}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Cost Optimization Impact</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">Predictive Staffing</span>
                        <span className="text-sm font-semibold text-emerald-600">$340K annual</span>
                      </div>
                      <p className="text-xs text-gray-600">72-hour demand forecasting optimizes resource allocation</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">Early Intervention</span>
                        <span className="text-sm font-semibold text-emerald-600">$1.2M annual</span>
                      </div>
                      <p className="text-xs text-gray-600">Reduces emergency interventions by 67% through prevention</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">Care Coordination</span>
                        <span className="text-sm font-semibold text-emerald-600">$580K annual</span>
                      </div>
                      <p className="text-xs text-gray-600">Automated workflows reduce administrative overhead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Status */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Active Alerts</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">High-risk patients</span>
                  <span className="text-sm font-semibold text-red-600">3</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Care team notifications</span>
                  <span className="text-sm font-semibold text-amber-600">18</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Family communications</span>
                  <span className="text-sm font-semibold text-blue-600">42</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-gray-900">System Performance</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">AI processing</span>
                  <span className="text-sm font-semibold text-emerald-600">2.3s avg</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Database uptime</span>
                  <span className="text-sm font-semibold text-emerald-600">99.8%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">TiDB performance</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="h-3 w-3 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <HeartIcon className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Quality Metrics</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Patient satisfaction</span>
                  <span className="text-sm font-semibold text-blue-600">4.8/5</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Provider engagement</span>
                  <span className="text-sm font-semibold text-blue-600">96%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Family portal usage</span>
                  <span className="text-sm font-semibold text-blue-600">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder Integration */}
        <div className="px-6 py-4">
          <div className="bg-slate-900 rounded-lg p-8 text-white mb-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-semibold mb-3">Integrated Care Ecosystem</h2>
              <p className="text-slate-300 mb-8">
                Administrative insights seamlessly connect with clinical operations and family engagement
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-blue-300">Clinical Operations</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Provider insights feed into population analytics, creating continuous improvement 
                    loops for clinical decision-making and resource optimization.
                  </p>
                  <Link 
                    to="/provider"
                    className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    Provider Dashboard <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-emerald-300">Family Engagement</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Family portal metrics and satisfaction data directly impact operational 
                    efficiency and quality improvement initiatives.
                  </p>
                  <Link 
                    to="/family"
                    className="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    Family Portal <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Dashboard */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <CpuChipIcon className="h-5 w-5 text-slate-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Technical Performance Analytics</h2>
                  <p className="text-sm text-gray-600 mt-1">Real-time TiDB performance and AI transparency metrics</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <TechnicalDashboard patientId="margaret_wilson" />
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="px-6 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Explore Connected Dashboards</h2>
              <p className="text-sm text-gray-600 mb-8">
                Experience how SynapseGuard coordinates care across all stakeholders
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/live-demo"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Live AI Demo
                </Link>
                <Link 
                  to="/provider"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Provider Dashboard
                </Link>
                <Link 
                  to="/"
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;