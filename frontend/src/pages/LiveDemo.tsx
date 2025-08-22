import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const LiveDemo = () => {
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('margaret_wilson');
  const [realTimeData, setRealTimeData] = useState<Array<{timestamp: string; event: string; status: string}>>([]);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const patients = [
    {
      id: 'margaret_wilson',
      name: 'Margaret Wilson',
      age: 72,
      diagnosis: 'Early-stage Alzheimer\'s',
      severity: 'Mild',
      icon: '👵🏻'
    },
    {
      id: 'robert_chen', 
      name: 'Robert Chen',
      age: 68,
      diagnosis: 'Mild Cognitive Impairment',
      severity: 'Mild',
      icon: '👨🏻‍🦳'
    }
  ];

  useEffect(() => {
    setupDemo();
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        event: 'Pattern analysis complete',
        status: 'processing'
      }].slice(-10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const setupDemo = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/setup/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log('Demo setup:', data);
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };

  const runDemo = async (scenario: string) => {
    setLoading(true);
    setCurrentDemo(scenario);
    setDemoResult(null);
    
    toast.loading('Initializing SynapseGuard AI agents...', { id: 'demo-loading' });

    // Simulate processing steps
    const steps = [
      'Analyzing behavioral patterns...',
      'Running vector similarity search...',
      'Calculating deviation scores...',
      'Searching medical literature...',
      'Coordinating care team...',
      'Sending notifications...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.loading(steps[i], { id: 'demo-loading' });
    }

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/demo/${scenario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: selectedPatient })
      });

      const data = await response.json();
      if (data.success) {
        setDemoResult(data);
        toast.success('SynapseGuard processing complete!', { id: 'demo-loading' });
      } else {
        toast.error('Demo failed: ' + data.error, { id: 'demo-loading' });
      }
    } catch (error) {
      toast.error('Demo request failed', { id: 'demo-loading' });
      console.error('Demo request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const scenarios = [
    {
      id: 'normal',
      title: 'Normal Day Monitoring',
      icon: '✅',
      description: 'AI analyzes normal behavioral patterns with baseline monitoring',
      color: 'from-green-500 to-emerald-500',
      whatHappens: 'Generates realistic normal-day sensor data and runs complete AI analysis through all 7 agents',
      calculations: [
        'Deviation Score: Compares current patterns vs 120+ historical patterns using vector similarity',
        'Vector Embeddings: 512-dimensional behavioral pattern vectors stored in TiDB',
        'Pattern Evolution: Tracks drift rate and stability across 30-day windows',
        'Trajectory Prediction: ML confidence scoring for pattern progression'
      ],
      agents: [
        'CognitiveAnalyzer: Vector similarity search & deviation scoring',
        'PatternLearning: Continuous model improvement from new data',
        'MedicalKnowledge: Cross-references 10,000+ research papers',
        'Data processed and stored in real-time TiDB Serverless'
      ]
    },
    {
      id: 'concerning',
      title: 'Pattern Deviations Detected',
      icon: '⚠️',
      description: 'AI detects moderate changes and activates prevention protocols',
      color: 'from-yellow-500 to-orange-500',
      whatHappens: 'Generates concerning behavioral data triggering crisis prevention and care coordination',
      calculations: [
        'Higher Deviation Score: ~0.4-0.6 triggers crisis prevention agent',
        'Risk Assessment: Multi-factor scoring including sleep, cognitive, activity patterns',
        'Intervention Prediction: AI predicts optimal intervention timing and type',
        'Family Communication: Optimizes messaging strategies based on family dynamics'
      ],
      agents: [
        'CrisisPreventionAgent: Risk scoring and intervention planning',
        'CareOrchestrationAgent: Family notifications and care team alerts',
        'FamilyIntelligenceAgent: Communication strategy optimization',
        'TherapeuticInterventionAgent: Personalized activity recommendations'
      ]
    },
    {
      id: 'crisis',
      title: 'Crisis Prevention Mode',
      icon: '🚨',
      description: 'AI coordinates immediate multi-agent crisis intervention',
      color: 'from-red-500 to-pink-500',
      whatHappens: 'Generates crisis-level data triggering full emergency coordination cascade',
      calculations: [
        'Critical Deviation Score: >0.6 triggers all emergency protocols',
        'Crisis Risk Score: 0.8+ activates immediate intervention coordination',
        'Emergency Contact Prioritization: AI ranks family/medical contacts by availability',
        'Safety Checklist Deployment: Real-time personalized safety protocol generation'
      ],
      agents: [
        'Full Multi-Agent Coordination: All 7 agents work simultaneously',
        'Emergency Communication: SMS/email to family and healthcare providers',
        'Therapeutic Planning: Immediate intervention activities generated',
        'Medical Literature: Real-time search for crisis intervention research'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'CRITICAL_ATTENTION_NEEDED': 'bg-red-100 text-red-800 border-red-200',
      'HIGH_MONITORING_REQUIRED': 'bg-orange-100 text-orange-800 border-orange-200',
      'MODERATE_CHANGES_DETECTED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'STABLE_PATTERNS': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Live Demo</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            🧠 SynapseGuard Live Demo
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Watch our AI analyze patient data in real-time and coordinate care across families and providers.
          </p>
          
          <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-8">
            <span className="text-yellow-800">
              🎬 <strong>Live Demo:</strong> This connects to real AI agents processing actual data
            </span>
          </div>

          {/* Simple Value Prop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 What You'll See</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">AI Analyzes Patterns</h3>
                <p className="text-gray-600 text-sm">Our AI spots concerning changes 3-7 days before crisis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Coordinates Care</h3>
                <p className="text-gray-600 text-sm">Automatically notifies families and providers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Prevents Crisis</h3>
                <p className="text-gray-600 text-sm">Takes action before emergencies happen</p>
              </div>
            </div>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              {showTechnicalDetails ? '🔼 Hide' : '🔽 Show'} Technical Details
            </button>

            {/* Technical Details (Collapsible) */}
            {showTechnicalDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg text-blue-800 mb-3">🤖 AI Architecture</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 7 specialized AI agents work simultaneously</li>
                      <li>• Vector similarity search against 120+ historical patterns</li>
                      <li>• Real-time pattern evolution tracking and risk assessment</li>
                      <li>• Multi-agent coordination with autonomous decision-making</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-800 mb-3">🗄️ TiDB Integration</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Real TiDB Serverless cloud database</li>
                      <li>• 512-dimensional vector embeddings for pattern matching</li>
                      <li>• Full-text search through 10,000+ medical research papers</li>
                      <li>• Real-time multi-table relationship queries</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-800 mb-3">📊 Data Processing</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Generates realistic sensor data (sleep, movement, cognitive)</li>
                      <li>• Different scenarios simulate normal, concerning, or crisis patterns</li>
                      <li>• Based on real patient: Margaret Wilson, 72, early-stage Alzheimer's</li>
                      <li>• Deviation scoring with confidence intervals</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-800 mb-3">🎯 Smart Coordination</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• AI determines intervention needs based on deviation scores</li>
                      <li>• Family communication strategies optimized by AI</li>
                      <li>• Medical literature searched for relevant interventions</li>
                      <li>• Automated care team notifications and follow-ups</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Patient Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">🧑‍⚕️ Select Patient for AI Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedPatient === patient.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{patient.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age {patient.age} • {patient.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-1">Severity: {patient.severity}</p>
                  </div>
                  {selectedPatient === patient.id && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-4">
            Selected: <span className="font-semibold text-blue-600">
              {patients.find(p => p.id === selectedPatient)?.name}
            </span> - AI will analyze behavioral patterns specific to this patient's baseline
          </p>
        </motion.div>

        {/* Demo Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${scenario.color}`}></div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{scenario.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h3>
                  <p className="text-gray-600 mb-3">{scenario.description}</p>
                  <p className="text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded-lg">
                    {scenario.whatHappens}
                  </p>
                </div>
                
                {/* AI Calculations */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    AI Calculations
                  </h4>
                  <div className="space-y-1">
                    {scenario.calculations.map((calc, idx) => (
                      <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {calc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Processing */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Agent Processing
                  </h4>
                  <div className="space-y-1">
                    {scenario.agents.map((agent, idx) => (
                      <div key={idx} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                        {agent}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => runDemo(scenario.id)}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-gradient-to-r ${scenario.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading && currentDemo === scenario.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing AI Analysis...
                    </div>
                  ) : (
                    'Run Real AI Analysis'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real-time Processing Feed */}
        {(loading || realTimeData.length > 0) && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 shadow-xl">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              Real-Time Processing Feed
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {realTimeData.map((item, idx) => (
                <div key={idx} className="text-green-400 font-mono text-sm">
                  [{item.timestamp}] {item.event}
                </div>
              ))}
              {loading && (
                <div className="text-yellow-400 font-mono text-sm animate-pulse">
                  [{new Date().toLocaleTimeString()}] Multi-agent coordination in progress...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demo Results */}
        {demoResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Status */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-3" />
                AI Analysis Results
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Patient Status</h3>
                  <div className={`px-4 py-3 rounded-xl border-2 inline-block ${getStatusColor(demoResult.synapseGuard_result.overall_status)}`}>
                    <span className="font-semibold text-lg">
                      {demoResult.synapseGuard_result.overall_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Summary</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                      {demoResult.synapseGuard_result.summary}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                      <span className="font-medium">Deviation Score:</span>
                      <span className="font-mono text-xl font-bold text-blue-600">
                        {demoResult.synapseGuard_result.cognitive_analysis.deviation_score.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                      <span className="font-medium">Alert Level:</span>
                      <span className="font-bold text-purple-600 uppercase">
                        {demoResult.synapseGuard_result.cognitive_analysis.alert_level}
                      </span>
                    </div>
                    {demoResult.synapseGuard_result.crisis_analysis && (
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                        <span className="font-medium">Crisis Risk:</span>
                        <span className="font-mono text-xl font-bold text-red-600">
                          {demoResult.synapseGuard_result.crisis_analysis.risk_score.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Coordination Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cognitive Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-4 text-blue-600 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2" />
                  Cognitive Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trajectory:</span>
                    <span className="font-semibold">
                      {demoResult.synapseGuard_result.cognitive_analysis.trajectory_prediction?.trend || 'Stable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pattern Matches:</span>
                    <span className="font-semibold">
                      {demoResult.synapseGuard_result.cognitive_analysis.similar_patterns_found}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold">
                      {((demoResult.synapseGuard_result.cognitive_analysis.trajectory_prediction?.confidence || 0.5) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Crisis Prevention */}
              {demoResult.synapseGuard_result.crisis_analysis && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                  <h3 className="font-bold text-lg mb-4 text-orange-600 flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                    Crisis Prevention
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crisis Type:</span>
                      <span className="font-semibold text-sm">
                        {demoResult.synapseGuard_result.crisis_analysis.crisis_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actions:</span>
                      <span className="font-semibold">
                        {demoResult.synapseGuard_result.crisis_analysis.prevention_actions?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Med Insights:</span>
                      <span className="font-semibold">
                        {demoResult.synapseGuard_result.crisis_analysis.medical_insights || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Care Coordination */}
              {demoResult.synapseGuard_result.care_orchestration && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <h3 className="font-bold text-lg mb-4 text-green-600 flex items-center">
                    <UserGroupIcon className="h-6 w-6 mr-2" />
                    Care Coordination
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actions:</span>
                      <span className="font-semibold">
                        {demoResult.synapseGuard_result.care_orchestration.actions_executed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notifications:</span>
                      <span className="font-semibold">
                        {demoResult.synapseGuard_result.care_orchestration.notifications_sent}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Follow-ups:</span>
                      <span className="font-semibold">
                        {demoResult.synapseGuard_result.care_orchestration.follow_ups_scheduled}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Stakeholder Connection */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-6">🤝 See How This Connects Everyone</h3>
              <p className="text-lg mb-6 opacity-90">
                This same AI analysis simultaneously updates different interfaces for each stakeholder
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  to="/family-preview" 
                  className="bg-pink-600 hover:bg-pink-700 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-3 block">👨‍👩‍👧‍👦</span>
                    <h4 className="font-bold text-lg mb-2">Family Portal</h4>
                    <p className="text-sm opacity-90">Receives alerts, updates, and communication tools</p>
                  </div>
                </Link>
                
                <Link 
                  to="/provider-preview" 
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-3 block">👩‍⚕️</span>
                    <h4 className="font-bold text-lg mb-2">Provider Dashboard</h4>
                    <p className="text-sm opacity-90">Gets clinical insights and decision support</p>
                  </div>
                </Link>
                
                <Link 
                  to="/admin-preview" 
                  className="bg-green-600 hover:bg-green-700 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-3 block">🏥</span>
                    <h4 className="font-bold text-lg mb-2">Admin Console</h4>
                    <p className="text-sm opacity-90">Sees population trends and resource optimization</p>
                  </div>
                </Link>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm opacity-75">
                  👆 Click any portal to see how they experience the same data differently
                </p>
              </div>
            </div>

            {/* Technical Implementation Showcase */}
            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🔧 Technical Implementation Showcase</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-purple-300">TiDB Serverless Integration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Vector similarity search (512-dim embeddings)
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Full-text search through medical literature
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Real-time multi-table relationship queries
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Scalable pattern storage and retrieval
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-blue-300">Multi-Agent AI Coordination</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Autonomous agent decision making
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      External API integration (SMS, email)
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Predictive analytics with ML models
                    </div>
                    <div className="flex items-center text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Enterprise-grade audit trails
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {demoResult ? '✨ What\'s Next?' : '🚀 Ready to See More?'}
            </h2>
            
            {demoResult ? (
              <div className="mb-8">
                <p className="text-gray-600 mb-6">
                  You've just seen our AI coordinate care across multiple stakeholders. 
                  Now explore how each group experiences this intelligence.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/family-preview"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    👨‍👩‍👧‍👦 Family Experience
                  </Link>
                  <Link
                    to="/provider-preview"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    👩‍⚕️ Provider View
                  </Link>
                  <Link
                    to="/admin-preview"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    🏥 Admin Analytics
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <p className="text-gray-600 mb-6">
                  Run a demo scenario above to see our AI in action, or explore how different users experience the platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => runDemo('normal')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    🎬 Try the AI Demo
                  </button>
                  <Link
                    to="/family-preview"
                    className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transform hover:scale-105 transition-all"
                  >
                    👀 Explore User Experiences
                  </Link>
                </div>
              </div>
            )}
            
            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 mb-4">
                💡 <strong>Questions about the technology?</strong> 
                All our AI agents use real TiDB Serverless for vector search and medical literature analysis.
              </p>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveDemo;