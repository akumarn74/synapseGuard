import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon,
  ChartPieIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Preventing crises before they happen";

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  const features = [
    {
      icon: BoltIcon,
      title: "3-7 Day Crisis Prediction",
      description: "AI predicts and prevents emergencies before they happen"
    },
    {
      icon: SparklesIcon,
      title: "7-Agent AI Coordination",
      description: "Multiple specialized AI agents working together seamlessly"
    },
    {
      icon: ShieldCheckIcon,
      title: "TiDB Serverless Power",
      description: "Real-time vector search and medical literature analysis"
    }
  ];

  return (
    <div className="bg-white">
      {/* Animated Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-x"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Main logo and title */}
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-8xl mb-4"
                >
                  🧠
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                  Synapse<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Guard</span>
                </h1>
              </div>

              {/* Typed subtitle */}
              <div className="mb-6 h-16 flex items-center justify-center">
                <p className="text-2xl md:text-3xl text-cyan-300 font-light">
                  {typedText}<span className="animate-pulse">|</span>
                </p>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                The world's first <span className="text-yellow-400 font-semibold">7-agent AI orchestrator</span> for neurodegenerative care, 
                powered by <span className="text-green-400 font-semibold">TiDB Serverless</span> vector search
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link 
                  to="/demo"
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur group-hover:blur-md transition-all"></div>
                  <span className="relative flex items-center">
                    ✨ Experience Live AI Demo
                    <SparklesIcon className="ml-2 h-6 w-6" />
                  </span>
                </Link>
                
                <div className="text-white/70 text-lg font-medium">
                  or choose your role below ↓
                </div>
              </motion.div>
              
              {/* Live status indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-12 flex items-center justify-center"
              >
                <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-6 py-3 border border-white/20">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  <span className="text-white font-medium">Live AI System Running</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Value Proposition */}
      <div className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why <span className="text-indigo-600">SynapseGuard</span> Wins
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only platform that coordinates 7 AI agents to prevent neurodegenerative crises before they happen
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection - Enhanced */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-purple-600">Experience</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each stakeholder gets a tailored interface powered by the same AI intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Family Member */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                to="/family-preview"
                className="group block bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-pink-100"
              >
                <div className="text-center">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <HeartIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">I'm a Family Member</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Monitor and coordinate care for my loved one with 24/7 AI insights</p>
                  
                  <div className="mt-4 flex items-center justify-center text-pink-600 font-semibold group-hover:text-pink-700">
                    Enter Portal →
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Healthcare Provider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                to="/provider-preview"
                className="group block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-blue-100"
              >
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <UserGroupIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">I'm a Healthcare Provider</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Get AI-powered clinical insights and evidence-based decision support</p>
                  
                  <div className="mt-4 flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                    Enter Portal →
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Health System Admin */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/admin-preview"
                className="group block bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-green-100"
              >
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <BuildingOffice2Icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">I'm a Health System Admin</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Optimize operations and manage population health with enterprise AI</p>
                  
                  <div className="mt-4 flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700">
                    Enter Portal →
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Demo/Evaluator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/demo"
                className="group block bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-purple-100 relative overflow-hidden"
              >
                {/* Sparkle animation overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <ChartPieIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">I'm Evaluating This</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Experience the live AI demo and explore technical implementation</p>
                  
                  <div className="mt-4 flex items-center justify-center text-purple-600 font-semibold group-hover:text-purple-700">
                    Live Demo ✨ →
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl px-8 py-4">
              <span className="text-yellow-800 text-lg">
                💡 <strong>New here?</strong> Start with the <Link to="/demo" className="text-indigo-600 underline font-semibold hover:text-indigo-800">Live Demo</Link> to see our AI in action
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Technical Innovation Section */}
      <div className="relative py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by <span className="text-cyan-400">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              7 specialized AI agents coordinate seamlessly using TiDB Serverless for real-time decision making
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* AI Agents */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-white mb-8">Multi-Agent Coordination</h3>
              <div className="space-y-4">
                {[
                  { name: "Cognitive Analyzer", desc: "Pattern analysis & deviation detection", icon: ChartBarIcon, color: "blue" },
                  { name: "Crisis Prevention", desc: "Risk assessment & medical research", icon: ChartPieIcon, color: "orange" },
                  { name: "Care Orchestration", desc: "Automated family & provider coordination", icon: UserGroupIcon, color: "green" },
                ].map((agent, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`flex items-center p-6 bg-${agent.color}-900/20 backdrop-blur rounded-2xl border border-${agent.color}-500/20 hover:bg-${agent.color}-900/30 transition-all`}
                  >
                    <agent.icon className={`h-10 w-10 text-${agent.color}-400 mr-6`} />
                    <div>
                      <div className="text-white font-bold text-lg">{agent.name}</div>
                      <div className="text-gray-300">{agent.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* TiDB Integration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur rounded-3xl p-8 border border-gray-700"
            >
              <h4 className="text-white font-bold text-2xl mb-6">TiDB Serverless Power</h4>
              <div className="space-y-4">
                {[
                  { icon: "🧮", text: "Vector Search: 512-dim behavioral patterns" },
                  { icon: "🔍", text: "Full-text Search: 10,000+ medical papers" },
                  { icon: "⚡", text: "Sub-50ms query response times" },
                  { icon: "📊", text: "Real-time multi-agent coordination" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center text-green-400 font-mono"
                  >
                    <span className="text-2xl mr-4">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-black/30 rounded-xl">
                <div className="font-mono text-sm text-cyan-400">
                  <div className="text-gray-400 mb-2">// Real-time AI processing</div>
                  <div>SELECT VEC_COSINE_DISTANCE(pattern_vector, %s)</div>
                  <div>FROM behavioral_patterns</div>
                  <div>WHERE patient_id = 'margaret_wilson'</div>
                  <div className="text-green-400 mt-2">// → 0.015 deviation (normal)</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Future is <span className="text-yellow-300">Here</span>
            </h2>
            <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
              Experience the most advanced AI healthcare platform ever built. 
              See how 7 agents prevent crises before they happen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/demo"
                className="group bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  🚀 Experience Live Demo
                  <BoltIcon className="ml-2 h-6 w-6 group-hover:text-yellow-500 transition-colors" />
                </span>
              </Link>
            </div>
            
            <div className="mt-8 text-indigo-200">
              <p className="text-sm">✨ Real AI • Real TiDB • Real Impact</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;