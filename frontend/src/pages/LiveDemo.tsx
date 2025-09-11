import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import RealTimeAgentStatus from '../components/RealTimeAgentStatus';
import { 
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  HeartIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BeakerIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const LiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoScenarios = [
    {
      id: 'normal',
      title: 'Normal Day Simulation',
      subtitle: 'See how AI analyzes typical daily patterns',
      description: 'We simulate realistic daily data for Margaret and show how our AI system would analyze her patterns against medical research to confirm everything is normal.',
      simulatedData: {
        sleep: '7.5 hours (good quality)',
        activity: '3,200 steps, morning walk',
        medication: 'Taken on time (9:15 AM)',
        cognitive: 'Normal response times'
      },
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      expectedOutcome: 'AI confirms patterns are normal, continues routine monitoring',
      icon: <CheckCircleIcon className="w-8 h-8 text-emerald-600" />,
      avatar: '✅',
      riskLevel: 'Normal'
    },
    {
      id: 'concerning',
      title: 'Early Warning Demo',
      subtitle: 'How AI detects concerning changes before they become crises',
      description: 'We simulate concerning behavioral patterns and demonstrate how our AI would detect these changes early and coordinate preventive care.',
      simulatedData: {
        sleep: '4.2 hours (fragmented)',
        activity: '800 steps, stayed in bed',
        medication: 'Missed morning dose',
        cognitive: 'Slower response times'
      },
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      expectedOutcome: 'AI triggers early intervention and family notification',
      icon: <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />,
      avatar: '⚠️',
      riskLevel: 'Concerning'
    },
    {
      id: 'progressive',
      title: 'Progressive Detection Demo',
      subtitle: 'Watch AI catch subtle changes over 5 days',
      description: 'Experience how our AI detects and responds to gradual pattern changes - from Day 1 (normal) to Day 5 (intervention needed). See real-time detection in action.',
      simulatedData: {
        day1: 'Normal patterns baseline',
        day2: 'Slight sleep reduction noticed',
        day3: 'Cognitive response delays detected', 
        day4: 'Activity levels declining',
        day5: 'Intervention threshold reached'
      },
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      expectedOutcome: 'AI catches deterioration before crisis, prevents hospitalization',
      icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
      avatar: '📈',
      riskLevel: 'Progressive'
    },
    {
      id: 'crisis',
      title: 'Crisis Prevention Demo',
      subtitle: 'Emergency response when critical patterns are detected',
      description: 'We simulate crisis-level patterns to show how our AI would immediately activate emergency protocols and coordinate care teams.',
      simulatedData: {
        sleep: '1.5 hours (severe insomnia)',
        activity: 'No movement detected',
        medication: 'Multiple missed doses',
        cognitive: 'No response to prompts'
      },
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      expectedOutcome: 'Full emergency response activated, care team notified immediately',
      icon: <XCircleIcon className="w-8 h-8 text-red-600" />,
      avatar: '🚨',
      riskLevel: 'Critical'
    }
  ];

  const analysisSteps = [
    { icon: <BeakerIcon className="w-5 h-5" />, text: 'Processing Simulated Patient Data', duration: 1500 },
    { icon: <CpuChipIcon className="w-5 h-5" />, text: 'AI Pattern Recognition Analysis', duration: 2000 },
    { icon: <DocumentTextIcon className="w-5 h-5" />, text: 'Searching 1,040+ Medical Research Papers', duration: 2500 },
    { icon: <ChartBarIcon className="w-5 h-5" />, text: 'Calculating Risk Assessment', duration: 1800 },
    { icon: <UserGroupIcon className="w-5 h-5" />, text: 'Generating Care Recommendations', duration: 2200 },
    { icon: <ShieldCheckIcon className="w-5 h-5" />, text: 'Finalizing Action Plan', duration: 1000 }
  ];

  const progressiveSteps = [
    { day: 1, icon: <CheckCircleIcon className="w-5 h-5" />, text: 'Day 1: Baseline patterns normal - 98% similarity to baseline', duration: 1200, alert: 'normal' },
    { day: 2, icon: <ClockIcon className="w-5 h-5" />, text: 'Day 2: Sleep reduction detected - 15% deviation from normal', duration: 1500, alert: 'slight' },
    { day: 3, icon: <CpuChipIcon className="w-5 h-5" />, text: 'Day 3: Cognitive delays emerging - 28% deviation threshold', duration: 1800, alert: 'monitoring' },
    { day: 4, icon: <ExclamationTriangleIcon className="w-5 h-5" />, text: 'Day 4: Activity decline confirmed - 45% deviation, early warning triggered', duration: 2000, alert: 'warning' },
    { day: 5, icon: <ShieldCheckIcon className="w-5 h-5" />, text: 'Day 5: Intervention threshold reached - Family contacted, care plan activated', duration: 2500, alert: 'intervention' }
  ];

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/health`);
      setConnectionError(!response.ok);
    } catch {
      setConnectionError(true);
    }
  };

  const runDemo = async (scenario: any) => {
    if (connectionError) {
      toast.error('System offline - please check backend connection');
      return;
    }

    setLoading(true);
    setActiveDemo(scenario.id);
    setDemoResult(null);
    setCurrentStep(0);

    if (scenario.id === 'progressive') {
      // Progressive detection demo - show day-by-day progression
      for (let i = 0; i < progressiveSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, progressiveSteps[i].duration));
      }
      
      // Simulate progressive detection result
      setDemoResult({
        scenario,
        success: true,
        synapseGuard_result: {
          detection_timeline: progressiveSteps.map(step => ({
            day: step.day,
            status: step.alert,
            description: step.text,
            deviation_score: step.day * 0.12, // Increasing deviation
            action_taken: step.day === 5 ? 'Intervention Activated' : 'Monitoring Continued'
          })),
          intervention_prevented: 'Potential hospitalization avoided through early detection',
          care_coordination: 'Family notified on Day 4, care plan adjusted on Day 5',
          outcome: 'Patient stabilized through proactive intervention'
        }
      });
      toast.success('✅ Progressive Detection Complete - Crisis Prevented');
    } else {
      // Standard demo processing
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, analysisSteps[i].duration));
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/demo/${scenario.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            patient_id: scenario.id === 'concerning' ? 'robert_chen' : 'margaret_wilson'
          })
        });

        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        setDemoResult({ ...data, scenario });
        toast.success('✅ AI Analysis Complete');
      } catch (error) {
        toast.error('❌ Analysis failed - please try again');
        console.error('Demo error:', error);
      }
    }
    
    setLoading(false);
    setActiveDemo(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-full ${
              connectionError 
                ? 'bg-red-100 text-red-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'
              }`}></div>
              <span className="text-sm font-medium">
                {connectionError ? 'Demo Offline' : 'Demo Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-6">
              <span className="text-3xl">🧠</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              SynapseGuard AI Demo
            </h1>
            <div className="bg-amber-100 border border-amber-300 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <BeakerIcon className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-800">Simulated Demo Environment</h2>
              </div>
              <p className="text-amber-800 leading-relaxed">
                This demo uses <strong>simulated patient data</strong> to show how our AI system would work in real healthcare settings. 
                We generate realistic behavioral patterns and demonstrate how our AI analyzes them against medical research to make care decisions.
                <strong> No real patient monitoring is happening here</strong> - this is a proof-of-concept demonstration.
              </p>
            </div>
          </motion.div>

          {/* System Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm bg-white rounded-2xl py-4 px-8 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">7 AI Agents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">TiDB Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">1,040+ Research Papers</span>
            </div>
          </div>
        </div>

        {/* Demo Scenarios */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose a Scenario to Demonstrate</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each scenario simulates different patient conditions and shows how our AI would respond with evidence-based care decisions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {demoScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${scenario.bgColor} ${scenario.borderColor} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                        {scenario.icon}
                      </div>
                      <div className="text-3xl">{scenario.avatar}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                        scenario.riskLevel === 'Normal' ? 'bg-emerald-200 text-emerald-800' :
                        scenario.riskLevel === 'Concerning' ? 'bg-amber-200 text-amber-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {scenario.riskLevel}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title}</h3>
                    <p className="text-lg font-medium text-gray-700 mb-4">{scenario.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">{scenario.description}</p>
                    
                    {/* Simulated Data Preview */}
                    <div className="bg-white/80 rounded-2xl p-4 mb-4">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <BeakerIcon className="w-4 h-4 mr-2" />
                        Simulated Patient Data
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Sleep:</span> {scenario.simulatedData.sleep}</div>
                        <div><span className="font-medium">Activity:</span> {scenario.simulatedData.activity}</div>
                        <div><span className="font-medium">Medication:</span> {scenario.simulatedData.medication}</div>
                        <div><span className="font-medium">Cognitive:</span> {scenario.simulatedData.cognitive}</div>
                      </div>
                    </div>

                    {/* Expected Outcome */}
                    <div className="bg-white/80 rounded-2xl p-4">
                      <div className="text-sm font-bold text-gray-700 mb-2">Expected AI Response</div>
                      <div className="text-sm text-gray-600">{scenario.expectedOutcome}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => runDemo(scenario)}
                    disabled={loading || connectionError}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${scenario.color} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3`}
                  >
                    {loading && activeDemo === scenario.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-5 h-5" />
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Processing Steps */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-600">Watch how our AI processes the simulated data and makes care decisions</p>
            </div>

            <div className="space-y-4">
              {(activeDemo === 'progressive' ? progressiveSteps : analysisSteps).map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    index === currentStep 
                      ? activeDemo === 'progressive' 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : 'bg-blue-50 border-2 border-blue-200'
                      : index < currentStep 
                        ? activeDemo === 'progressive'
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-emerald-50 border-2 border-emerald-200'
                        : 'bg-gray-50 border-2 border-gray-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                    index === currentStep
                      ? 'bg-blue-500 text-white animate-pulse'
                      : index < currentStep
                        ? activeDemo === 'progressive' && 'alert' in step && (step as any).alert === 'intervention'
                          ? 'bg-red-500 text-white'
                          : activeDemo === 'progressive' && 'alert' in step && (step as any).alert === 'warning'
                          ? 'bg-orange-500 text-white'
                          : 'bg-emerald-500 text-white'
                        : 'bg-gray-300 text-gray-500'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : index === currentStep ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1">
                    {activeDemo === 'progressive' && 'day' in step && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          Day {(step as any).day}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          'alert' in step && (step as any).alert === 'normal' ? 'bg-green-100 text-green-800' :
                          'alert' in step && (step as any).alert === 'slight' ? 'bg-yellow-100 text-yellow-800' :
                          'alert' in step && (step as any).alert === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                          'alert' in step && (step as any).alert === 'warning' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {'alert' in step && (step as any).alert === 'normal' ? 'Normal' :
                           'alert' in step && (step as any).alert === 'slight' ? 'Slight Change' :
                           'alert' in step && (step as any).alert === 'monitoring' ? 'Monitoring' :
                           'alert' in step && (step as any).alert === 'warning' ? 'Early Warning' :
                           'Intervention'}
                        </span>
                      </div>
                    )}
                    <div className={`font-semibold ${
                      index === currentStep ? 'text-blue-900' : 
                      index < currentStep ? 'text-emerald-900' : 'text-gray-500'
                    }`}>
                      {step.text}
                    </div>
                  </div>
                  {index === currentStep && (
                    <div className="text-blue-600 text-sm font-medium animate-pulse">
                      Processing...
                    </div>
                  )}
                  {index < currentStep && (
                    <div className="text-emerald-600 text-sm font-medium">
                      ✓ Complete
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {demoResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
              {/* Results Header */}
              <div className={`${demoResult.scenario.bgColor} px-8 py-6 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">AI Analysis Results</h2>
                      <p className="text-gray-600">{demoResult.scenario.title} Simulation Complete</p>
                    </div>
                  </div>
                  <div className="text-4xl">{demoResult.scenario.avatar}</div>
                </div>
              </div>

              <div className="p-8">
                {/* AI Decision Summary */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                    <CpuChipIcon className="w-6 h-6 mr-3" />
                    AI Care Decision
                  </h3>
                  <p className="text-blue-800 text-lg leading-relaxed">
                    Based on the simulated data, our AI system determined: <strong>"{demoResult.scenario.expectedOutcome}"</strong>
                  </p>
                </div>

                {/* Progressive Detection Timeline or Key Metrics */}
                {demoResult.scenario.id === 'progressive' ? (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <ClockIcon className="w-6 h-6 mr-3 text-blue-600" />
                      5-Day Detection Timeline
                    </h3>
                    <div className="space-y-4">
                      {demoResult.synapseGuard_result?.detection_timeline?.map((day: any, idx: number) => (
                        <div key={idx} className={`flex items-center space-x-4 p-4 rounded-xl border-2 ${
                          day.status === 'intervention' ? 'bg-red-50 border-red-200' :
                          day.status === 'warning' ? 'bg-orange-50 border-orange-200' :
                          day.status === 'monitoring' ? 'bg-blue-50 border-blue-200' :
                          day.status === 'slight' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            day.status === 'intervention' ? 'bg-red-500' :
                            day.status === 'warning' ? 'bg-orange-500' :
                            day.status === 'monitoring' ? 'bg-blue-500' :
                            day.status === 'slight' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}>
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{day.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">
                                Deviation: {(day.deviation_score * 100).toFixed(0)}%
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                day.status === 'intervention' ? 'bg-red-100 text-red-800' :
                                day.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                                day.status === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                                day.status === 'slight' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {day.action_taken}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Progressive Results Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-2">✓ Prevented</div>
                        <div className="text-gray-600 text-sm">Crisis Avoided</div>
                      </div>
                      <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600 mb-2">Day 4</div>
                        <div className="text-gray-600 text-sm">Early Detection</div>
                      </div>
                      <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 mb-2">60%</div>
                        <div className="text-gray-600 text-sm">Peak Deviation</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {(demoResult.synapseGuard_result?.crisis_prevention?.risk_score * 100 || 0).toFixed(0)}%
                      </div>
                      <div className="text-gray-600 font-medium">Calculated Risk Score</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        {demoResult.synapseGuard_result?.cognitive_analysis?.similar_patterns_found || 0}
                      </div>
                      <div className="text-gray-600 font-medium">Similar Patterns Found</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <div className={`text-3xl font-bold mb-2 ${
                        demoResult.synapseGuard_result?.crisis_prevention?.risk_level === 'low' ? 'text-emerald-600' :
                        demoResult.synapseGuard_result?.crisis_prevention?.risk_level === 'medium' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {demoResult.synapseGuard_result?.crisis_prevention?.risk_level?.toUpperCase() || 'NORMAL'}
                      </div>
                      <div className="text-gray-600 font-medium">Alert Level</div>
                    </div>
                  </div>
                )}

                {/* Medical Research Evidence */}
                {demoResult.synapseGuard_result?.crisis_prevention?.medical_literature_insights && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <DocumentTextIcon className="w-6 h-6 mr-3 text-purple-600" />
                      Evidence from Medical Research
                    </h3>
                    <p className="text-gray-600 mb-4">Our AI found these relevant medical studies to support its decision:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {demoResult.synapseGuard_result.crisis_prevention.medical_literature_insights.slice(0, 4).map((insight: any, idx: number) => (
                        <div key={idx} className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{insight.title}</h4>
                            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                              {(insight.relevance * 100).toFixed(0)}% relevant
                            </span>
                          </div>
                          <p className="text-xs text-purple-700 font-medium mb-2">{insight.source}</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{insight.content.substring(0, 180)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What This Means */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What This Means for Real Healthcare</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In a real implementation, this AI analysis would trigger specific care protocols. The system would automatically notify healthcare providers, 
                    family members, and care coordinators with evidence-based recommendations. This demo shows how AI can make complex medical decisions 
                    by analyzing patterns against thousands of research papers in seconds.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setDemoResult(null)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close Results
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Try Another Scenario
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live Agent Coordination */}
        <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-3xl shadow-2xl p-12 max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-4"></div>
              <h2 className="text-3xl font-bold text-white">Live Multi-Agent AI Coordination</h2>
            </div>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-4">
              Watch our AI agents working together in real-time to process patient data, analyze patterns, and coordinate care decisions
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/50 rounded-full text-sm text-blue-300">
              <CpuChipIcon className="w-4 h-4 mr-2" />
              Connected to live TiDB Serverless database
            </div>
          </div>
          
          <RealTimeAgentStatus />
        </div>

        {/* Technology Explanation */}
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Technology Behind SynapseGuard</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              This demo simulates how our AI system would work in real healthcare environments with actual patient monitoring devices and sensors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-World Sensors</h3>
              <p className="text-sm text-gray-600">Wearables, smart home devices, medication dispensers monitor patient data 24/7</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CpuChipIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">7 specialized AI agents analyze patterns against medical research database</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Early Detection</h3>
              <p className="text-sm text-gray-600">System detects concerning patterns days or weeks before human observation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Care Coordination</h3>
              <p className="text-sm text-gray-600">Automated alerts to family, doctors, and emergency services with action plans</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">This Demo Took ~12 Seconds</h3>
            <p className="text-blue-800">In real-time, our AI continuously monitors and can detect crisis patterns within minutes of onset</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDemo;