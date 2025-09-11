import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ExclamationTriangleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon
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
      const response = await fetch(`http://localhost:5001/api/family/patient-status/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setPatientStatus(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch patient status:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Family Portal</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <HeartIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Family Portal Preview
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how family members stay connected with their loved ones through real-time monitoring, 
            instant alerts, and seamless care coordination.
          </p>
          
          <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <span className="text-yellow-800">
              🚧 <strong>Preview Mode:</strong> This is a demonstration of the family portal interface
            </span>
          </div>
        </motion.div>

        {/* Patient Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? "Patient's Status" : `${patientStatus.patient.name}'s Status`}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">
                {loading ? 'Loading...' : 'Active Monitoring'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Wellness</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : `${patientStatus.patient.wellness_score}%`}
                  </p>
                  <p className="text-sm text-green-600">
                    {loading ? '...' : patientStatus.patient.wellness_score > 80 ? 'Stable patterns' : 'Monitoring needed'}
                  </p>
                </div>
                <HeartIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="text-lg font-bold text-blue-600">
                    {loading ? '...' : (patientStatus.patient.last_activity || 'No recent activity')}
                  </p>
                  <p className="text-sm text-blue-600">
                    {loading ? '...' : getTimeAgo(patientStatus.patient.last_activity_time)}
                  </p>
                </div>
                <ClockIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mood Today</p>
                  <p className={`text-lg font-bold ${getMoodColor(patientStatus.patient.mood)}`}>
                    {loading ? '...' : getMoodCapitalized(patientStatus.patient.mood)}
                  </p>
                  <p className="text-sm text-purple-600">AI-assessed</p>
                </div>
                <UserIcon className="h-12 w-12 text-purple-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent AI Insights</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading recent insights...</div>
            ) : patientStatus.recent_insights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recent AI insights available</div>
            ) : (
              patientStatus.recent_insights.map((insight, index) => (
                <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl ${
                  insight.type.includes('crisis') ? 'bg-red-50' :
                  insight.type.includes('monitor') ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className={`rounded-full p-2 ${
                    insight.type.includes('crisis') ? 'bg-red-500' :
                    insight.type.includes('monitor') ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {insight.type.includes('crisis') ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                    ) : insight.type.includes('pattern') ? (
                      <ChartBarIcon className="h-5 w-5 text-white" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {insight.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-gray-600 text-sm">{insight.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {getTimeAgo(insight.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
              <PhoneIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">
                Call {loading ? '...' : (patientStatus.patient.name ? patientStatus.patient.name.split(' ')[0] : 'Patient')}
              </p>
            </button>
            
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">Send Message</p>
            </button>
            
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
              <ChartBarIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">View Reports</p>
            </button>
            
            <Link
              to="/patient"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-center"
            >
              <UserIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">Patient View</p>
            </Link>
          </div>
        </motion.div>

        {/* Connection to Other Stakeholders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Connected Care Team</h2>
          <p className="text-lg mb-8 opacity-90">
            See how the AI coordinates with other stakeholders to ensure comprehensive care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300">Healthcare Provider Dashboard</h3>
              <p className="text-sm opacity-90 mb-4">
                Dr. Johnson receives the same AI insights plus clinical decision support and risk assessments
              </p>
              <Link 
                to="/provider-preview"
                className="inline-flex items-center text-blue-300 hover:text-blue-200"
              >
                View Provider Dashboard <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-300">Health System Analytics</h3>
              <p className="text-sm opacity-90 mb-4">
                Hospital administrators see population trends and resource optimization opportunities
              </p>
              <Link 
                to="/admin-preview"
                className="inline-flex items-center text-green-300 hover:text-green-200"
              >
                View Admin Console <ArrowRightIcon className="h-4 w-4 ml-2" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/demo"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
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

export default FamilyPortal;