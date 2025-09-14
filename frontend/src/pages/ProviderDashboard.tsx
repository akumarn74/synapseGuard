import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  HeartIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ProviderDashboard: React.FC = () => {
  const [riskSummary, setRiskSummary] = useState({
    summary: {
      high_risk_count: 0,
      moderate_risk_count: 0,
      stable_count: 0,
      high_risk_patients: [],
      moderate_risk_patients: [],
      total_patients: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskSummary();
    // Refresh every 2 minutes for provider dashboard
    const interval = setInterval(fetchRiskSummary, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiskSummary = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/provider/patient-risk-summary`);
      const data = await response.json();
      if (data.success) {
        setRiskSummary(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch risk summary:', error);
      // Fallback data for demo
      setRiskSummary({
        summary: {
          high_risk_count: 3,
          moderate_risk_count: 12,
          stable_count: 89,
          high_risk_patients: ['Margaret Wilson', 'Robert Chen', 'Sarah Johnson'],
          moderate_risk_patients: ['David Miller', 'Lisa Anderson'],
          total_patients: 104
        }
      });
      setLoading(false);
    }
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
                <span className="text-gray-900 font-medium">Clinical Dashboard</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Provider Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    AI-powered clinical decision support and patient management
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Risk Overview */}
        <div className="px-6 py-6">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Patient Risk Assessment</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>Updated 2 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">High Risk</p>
                      <p className="text-xs text-gray-500">Immediate attention required</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-red-600 mb-2">
                    {loading ? '...' : riskSummary.summary.high_risk_count}
                  </p>
                  <p className="text-xs text-red-600">patients in crisis prevention</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Moderate Risk</p>
                      <p className="text-xs text-gray-500">Enhanced monitoring</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-amber-600 mb-2">
                    {loading ? '...' : riskSummary.summary.moderate_risk_count}
                  </p>
                  <p className="text-xs text-amber-600">patients under watch</p>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Stable</p>
                      <p className="text-xs text-gray-500">Standard care protocol</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-emerald-600 mb-2">
                    {loading ? '...' : riskSummary.summary.stable_count}
                  </p>
                  <p className="text-xs text-emerald-600">patients on routine care</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Decision Support */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Clinical Decision Support</h2>
              <p className="text-sm text-gray-600 mt-1">AI-powered patient insights and recommendations</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* High Priority Patient */}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">Margaret Wilson, 72</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        HIGH RISK
                      </span>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-800 mb-3">
                        <span className="font-medium text-red-800">AI Alert:</span> Deviation score 0.72 - pattern anomalies detected in sleep and cognitive metrics. 
                        Vector similarity search indicates 85% match with pre-crisis patterns.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Schedule cognitive assessment within 48h</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Review sleep medications</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Increase family communication frequency</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Supporting Evidence</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Sleep fragmentation increased 40%</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Cognitive test scores declining</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Social interaction reduced</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/patient"
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Patient App
                      </Link>
                      <Link
                        to="/family"
                        className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Family Portal
                      </Link>
                      <button className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                        Update Care Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Moderate Risk Patient */}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChartBarIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">Robert Chen, 68</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        MODERATE RISK
                      </span>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium text-amber-800">AI Insight:</span> Gradual cognitive pattern changes detected. 
                        Enhanced monitoring recommended. Model suggests 65% probability of progression.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Analysis
                      </button>
                      <button className="bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        Schedule Follow-up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Tools */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Clinical Decision Tools</h2>
              <p className="text-sm text-gray-600 mt-1">AI-powered diagnostic and treatment support</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BeakerIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 mb-1">Risk Calculator</p>
                  <p className="text-xs text-center text-gray-600">AI-powered prediction models</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 mb-1">Literature Search</p>
                  <p className="text-xs text-center text-gray-600">10,000+ research papers</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 mb-1">Care Protocols</p>
                  <p className="text-xs text-center text-gray-600">Evidence-based guidelines</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 mb-1">Analytics</p>
                  <p className="text-xs text-center text-gray-600">Population insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Care Coordination */}
        <div className="px-6 py-4">
          <div className="bg-slate-900 rounded-lg p-8 text-white mb-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-semibold mb-3">Coordinated Care Network</h2>
              <p className="text-slate-300 mb-8">
                Your clinical insights seamlessly integrate with family engagement and system operations
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-emerald-300">Family Portal Integration</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Families receive AI-generated updates while maintaining clinical privacy. 
                    Automated communication optimizes engagement strategies.
                  </p>
                  <Link 
                    to="/family"
                    className="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    Family Experience <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-blue-300">System Analytics</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Clinical decisions contribute to population health insights and 
                    resource optimization at the health system level.
                  </p>
                  <Link 
                    to="/admin"
                    className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    System Dashboard <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="px-6 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience AI in Clinical Practice</h2>
              <p className="text-sm text-gray-600 mb-8">
                See how SynapseGuard transforms clinical decision-making with real-time AI insights
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/live-demo"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Live AI Demo
                </Link>
                <Link 
                  to="/admin"
                  className="bg-slate-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Admin Dashboard
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

export default ProviderDashboard;