import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  ClockIcon,
  CalendarDaysIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  MicrophoneIcon,
  PhoneIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

interface PatientData {
  name: string;
  age: number;
  todayScore: number;
  mood: 'good' | 'neutral' | 'challenging';
  lastActivity: string;
}

interface Activity {
  time: string;
  activity: string;
  completed: boolean;
  type: 'medication' | 'social' | 'physical' | 'routine' | 'cognitive';
}

interface QuickAction {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  action: 'call_family' | 'photo_memory' | 'voice_note' | 'help';
}

interface CognitiveGame {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  time: string;
}

const PatientApp: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: 0,
    todayScore: 0,
    mood: 'good',
    lastActivity: ''
  });
  const [loading, setLoading] = useState(true);

  // Default to Margaret Wilson, but this could be dynamic based on patient login
  const patientId = 'margaret_wilson';
  
  const [todayActivities] = useState<Activity[]>([
    { time: '8:00 AM', activity: 'Morning medication', completed: true, type: 'medication' },
    { time: '9:00 AM', activity: 'Breakfast with Sarah', completed: true, type: 'social' },
    { time: '10:30 AM', activity: 'Daily walk', completed: true, type: 'physical' },
    { time: '12:00 PM', activity: 'Lunch time', completed: false, type: 'routine' },
    { time: '2:00 PM', activity: 'Video call with family', completed: false, type: 'social' },
    { time: '3:30 PM', activity: 'Cognitive exercises', completed: false, type: 'cognitive' },
    { time: '6:00 PM', activity: 'Dinner preparation', completed: false, type: 'routine' },
    { time: '8:00 PM', activity: 'Evening medication', completed: false, type: 'medication' }
  ]);

  const [quickActions] = useState<QuickAction[]>([
    { name: 'Call Sarah', icon: PhoneIcon, color: 'bg-blue-500', action: 'call_family' },
    { name: 'Photo Memory', icon: CameraIcon, color: 'bg-green-500', action: 'photo_memory' },
    { name: 'Voice Note', icon: MicrophoneIcon, color: 'bg-purple-500', action: 'voice_note' },
    { name: 'Help', icon: HeartIcon, color: 'bg-red-500', action: 'help' }
  ]);

  const [cognitiveGames] = useState<CognitiveGame[]>([
    { name: 'Word Puzzle', difficulty: 'Easy', icon: PuzzlePieceIcon, time: '5 min' },
    { name: 'Memory Match', difficulty: 'Medium', icon: PuzzlePieceIcon, time: '10 min' },
    { name: 'Name That Tune', difficulty: 'Easy', icon: PuzzlePieceIcon, time: '8 min' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Fetch patient data
    fetchPatientData();
    
    return () => clearInterval(timer);
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/family/patient-status/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setPatientData({
          name: data.patient.name,
          age: 72, // Would come from patient profile
          todayScore: data.patient.wellness_score,
          mood: data.patient.mood,
          lastActivity: data.patient.last_activity || 'No recent activity'
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
      setLoading(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Good Morning', icon: SunIcon };
    if (hour < 18) return { greeting: 'Good Afternoon', icon: SunIcon };
    return { greeting: 'Good Evening', icon: MoonIcon };
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'medication': return '💊';
      case 'social': return '👥';
      case 'physical': return '🚶';
      case 'cognitive': return '🧠';
      case 'routine': return '🍽️';
      default: return '📝';
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'call_family':
        window.location.href = 'tel:+15550123';
        break;
      case 'photo_memory':
        // In real app, would open camera for memory sharing
        alert('Opening photo memory sharing...');
        break;
      case 'voice_note':
        // In real app, would start voice recording
        alert('Starting voice note recording...');
        break;
      case 'help':
        alert('Connecting to care team...');
        break;
      default:
        break;
    }
  };

  const timeOfDay = getTimeOfDay();
  const TimeIcon = timeOfDay.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Breadcrumbs - Mobile friendly */}
        <div className="mb-4 px-2">
          <div className="flex items-center text-xs text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Patient App</span>
          </div>
        </div>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-3">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{timeOfDay.greeting}</h1>
                <p className="text-lg text-gray-600">
                  {loading ? 'Loading...' : (patientData.name || 'Patient')}
                </p>
              </div>
            </div>
            <TimeIcon className="h-10 w-10 text-yellow-500" />
          </div>
          
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Today's Wellness</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : `${patientData.todayScore}%`}
                </p>
                <p className="text-sm opacity-90">
                  Feeling {loading ? '...' : patientData.mood}
                </p>
              </div>
              <HeartIcon className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Current Time */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6 text-center"
        >
          <ClockIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </h2>
          <p className="text-lg text-gray-600">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <HomeIcon className="h-6 w-6 mr-2 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.action)}
                className={`${action.color} text-white rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg`}
              >
                <action.icon className="h-8 w-8" />
                <span className="text-sm font-medium">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-blue-600" />
            Today's Activities
          </h3>
          <div className="space-y-3">
            {todayActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center space-x-3 p-3 rounded-xl ${
                  activity.completed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.activity}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  activity.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300'
                }`}>
                  {activity.completed && '✓'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cognitive Games */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <PuzzlePieceIcon className="h-6 w-6 mr-2 text-purple-600" />
            Brain Exercises
          </h3>
          <div className="space-y-3">
            {cognitiveGames.map((game, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl p-4 flex items-center space-x-3 shadow-lg"
              >
                <game.icon className="h-8 w-8" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{game.name}</p>
                  <p className="text-sm opacity-90">{game.difficulty} • {game.time}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium">Play</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Family Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-20"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-green-600" />
            Family Messages
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-4">
              <p className="font-medium mb-1">Sarah (Daughter)</p>
              <p className="text-sm opacity-90">"Good morning Mom! Hope you're having a wonderful day. Love you! 💕"</p>
              <p className="text-xs opacity-75 mt-2">2 hours ago</p>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl p-4">
              <p className="font-medium mb-1">Michael (Son)</p>
              <p className="text-sm opacity-90">"Looking forward to our video call this afternoon! 📹"</p>
              <p className="text-xs opacity-75 mt-2">1 hour ago</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center space-y-1 p-2"
            >
              <HomeIcon className="h-6 w-6 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Home</span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center space-y-1 p-2"
            >
              <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Schedule</span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center space-y-1 p-2"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Messages</span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center space-y-1 p-2"
            >
              <UserIcon className="h-6 w-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Profile</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientApp;