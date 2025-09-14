import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ExclamationTriangleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const FamilyPortal: React.FC = () => {
  const [patientStatus, setPatientStatus] = useState({
    patient: {
      name: '',
      wellness_score: 0,
      mood: 'good',
      last_activity: '',
      last_activity_time: null
    },
    recent_insights: []
  });
  const [loading, setLoading] = useState(true);

  // Default to Margaret Wilson, but this could be dynamic based on family login
  const patientId = 'margaret_wilson';

  useEffect(() => {
    fetchPatientStatus();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPatientStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPatientStatus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/family/patient-status/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setPatientStatus(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch patient status:', error);
      // Fallback data for demo
      setPatientStatus({
        patient: {
          name: 'Margaret Wilson',
          wellness_score: 87,
          mood: 'good',
          last_activity: 'Morning walk completed',
          last_activity_time: new Date().toISOString()
        },
        recent_insights: [
          {
            type: 'wellness_update',
            message: 'Sleep patterns have improved over the past week. Cognitive exercises show positive engagement.',
            timestamp: new Date().toISOString()
          },
          {
            type: 'pattern_detected',
            message: 'AI detected increased social activity. This is a positive indicator for overall well-being.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ]
      });
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'good': return 'text-green-600';
      case 'challenging': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getMoodCapitalized = (mood) => {
    return mood.charAt(0).toUpperCase() + mood.slice(1);
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
                <span className="text-gray-900 font-medium">Family Portal</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Family Portal
                  </h1>
                  <p className="text-sm text-gray-600">
                    Stay connected with your loved one's care journey
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Monitoring Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Status Overview */}
        <div className="px-6 py-6">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? "Patient Status" : `${patientStatus.patient.name}'s Daily Summary`}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-emerald-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {loading ? 'Loading...' : 'Monitoring Active'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <HeartIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Wellness Score</p>
                      <p className="text-xs text-gray-500">Overall daily assessment</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-emerald-600 mb-2">
                    {loading ? '...' : `${patientStatus.patient.wellness_score}%`}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {loading ? '...' : patientStatus.patient.wellness_score > 80 ? 'Stable patterns detected' : 'Enhanced monitoring active'}
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recent Activity</p>
                      <p className="text-xs text-gray-500">Latest recorded activity</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    {loading ? '...' : (patientStatus.patient.last_activity || 'No recent activity')}
                  </p>
                  <p className="text-xs text-blue-600">
                    {loading ? '...' : getTimeAgo(patientStatus.patient.last_activity_time)}
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mood Assessment</p>
                      <p className="text-xs text-gray-500">AI-evaluated wellbeing</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold mb-2 ${getMoodColor(patientStatus.patient.mood)}`}>
                    {loading ? '...' : getMoodCapitalized(patientStatus.patient.mood)}
                  </p>
                  <p className="text-xs text-purple-600">Based on daily interactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent AI Insights</h2>
              <p className="text-sm text-gray-600 mt-1">Automated updates and pattern detection</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading insights...</div>
                ) : patientStatus.recent_insights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No recent insights available</div>
                ) : (
                  patientStatus.recent_insights.map((insight, index) => (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg border ${
                      insight.type.includes('crisis') ? 'bg-red-50 border-red-200' :
                      insight.type.includes('monitor') ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        insight.type.includes('crisis') ? 'bg-red-100' :
                        insight.type.includes('monitor') ? 'bg-amber-100' : 'bg-emerald-100'
                      }`}>
                        {insight.type.includes('crisis') ? (
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                        ) : insight.type.includes('pattern') ? (
                          <ChartBarIcon className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <HeartIcon className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {insight.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(insight.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4">
          <div className="bg-white border border-gray-200 rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Communication & Actions</h2>
              <p className="text-sm text-gray-600 mt-1">Stay connected and access important information</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <PhoneIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Call {loading ? '...' : (patientStatus.patient.name ? patientStatus.patient.name.split(' ')[0] : 'Patient')}
                  </p>
                </button>
                
                <button className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors text-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Send Message</p>
                </button>
                
                <button className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">View Reports</p>
                </button>
                
                <Link
                  to="/patient"
                  className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors text-center"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <UserIcon className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Patient View</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Care Team Connection */}
        <div className="px-6 py-4">
          <div className="bg-slate-900 rounded-lg p-8 text-white mb-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-semibold mb-3">Connected Care Team</h2>
              <p className="text-slate-300 mb-8">
                Your family portal seamlessly connects with clinical care and system operations
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-blue-300">Healthcare Provider</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Your care team receives the same AI insights plus clinical decision support 
                    and risk assessments for coordinated care.
                  </p>
                  <Link 
                    to="/provider"
                    className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    Provider Dashboard <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-3 text-emerald-300">System Operations</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Hospital administrators use population trends and family engagement 
                    data to optimize resources and improve care quality.
                  </p>
                  <Link 
                    to="/admin"
                    className="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    Admin Console <ArrowRightIcon className="h-3 w-3 ml-1" />
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
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience Family-Centered Care</h2>
              <p className="text-sm text-gray-600 mb-8">
                See how SynapseGuard keeps families connected and informed throughout the care journey
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/live-demo"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Live AI Demo
                </Link>
                <Link 
                  to="/provider"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Provider View
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

export default FamilyPortal;