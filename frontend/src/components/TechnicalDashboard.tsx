import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  ClockIcon,
  ServerIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface TechnicalDashboardProps {
  patientId?: string;
}

const TechnicalDashboard: React.FC<TechnicalDashboardProps> = ({ patientId = 'margaret_wilson' }) => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [explainabilityData, setExplainabilityData] = useState<any>(null);
  const [roiData, setRoiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'performance' | 'ai' | 'roi'>('performance');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [patientId]);

  const fetchAllData = async () => {
    try {
      const [perfResponse, aiResponse, roiResponse] = await Promise.all([
        fetch('http://localhost:5001/api/technical/tidb-performance'),
        fetch(`http://localhost:5001/api/technical/ai-explainability/${patientId}`),
        fetch('http://localhost:5001/api/business/healthcare-roi')
      ]);

      const [perfData, aiData, roiDataResult] = await Promise.all([
        perfResponse.json(),
        aiResponse.json(),
        roiResponse.json()
      ]);

      if (perfData.success) setPerformanceData(perfData);
      if (aiData.success) setExplainabilityData(aiData);
      if (roiDataResult.success) setRoiData(roiDataResult);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch technical data:', error);
      setLoading(false);
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    trend?: 'up' | 'down' | 'stable';
    animate?: boolean;
  }> = ({ title, value, subtitle, icon: Icon, color, trend, animate = true }) => (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 ${
                trend === 'up' ? 'text-emerald-200' : 
                trend === 'down' ? 'text-red-200' : 'text-blue-200'
              }`}>
                <ArrowTrendingUpIcon className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                <span className="text-xs font-medium">
                  {trend === 'up' ? 'Optimized' : trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-white/90 text-sm font-medium mb-2">{title}</h3>
          <div className="text-white text-2xl font-bold mb-1">{value}</div>
          {subtitle && (
            <p className="text-white/70 text-xs">{subtitle}</p>
          )}
        </div>
        <div className="w-2 h-16 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: '75%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white/40 w-full rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );

  const TabButton: React.FC<{
    id: 'performance' | 'ai' | 'roi';
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
  }> = ({ id, title, icon: Icon, description }) => (
    <motion.button
      onClick={() => setActiveTab(id)}
      className={`relative flex-1 p-4 rounded-xl transition-all duration-300 ${
        activeTab === id
          ? 'bg-white shadow-lg text-gray-900'
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6" />
        <div className="text-left">
          <div className="font-semibold">{title}</div>
          <div className="text-xs opacity-75">{description}</div>
        </div>
      </div>
      {activeTab === id && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
        />
      )}
    </motion.button>
  );

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8">
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full"
          />
          <span className="text-white text-lg font-medium">Loading technical insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Technical Deep Dive</h2>
          <p className="text-blue-200">Real-time TiDB performance, AI reasoning, and business impact</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-200 font-medium">Live Data</span>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <TabButton
          id="performance"
          title="TiDB Performance"
          icon={CpuChipIcon}
          description="Database & query metrics"
        />
        <TabButton
          id="ai"
          title="AI Explainability"
          icon={LightBulbIcon}
          description="Decision reasoning & vectors"
        />
        <TabButton
          id="roi"
          title="Healthcare ROI"
          icon={CurrencyDollarIcon}
          description="Business impact & outcomes"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* TiDB Performance Tab */}
        {activeTab === 'performance' && performanceData && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Vector Search"
                value={`${performanceData.performance.vector_search_ms}ms`}
                subtitle="Sub-50ms target"
                icon={ChartBarIcon}
                color="from-emerald-500 to-teal-600"
                trend="up"
              />
              <MetricCard
                title="Full-Text Query"
                value={`${performanceData.performance.fulltext_search_ms}ms`}
                subtitle="Medical literature"
                icon={ClockIcon}
                color="from-blue-500 to-indigo-600"
                trend="up"
              />
              <MetricCard
                title="Active Connections"
                value={performanceData.database_stats.active_connections}
                subtitle="TiDB Serverless"
                icon={ServerIcon}
                color="from-purple-500 to-pink-600"
                trend="stable"
              />
              <MetricCard
                title="Storage Size"
                value={`${performanceData.database_stats.database_size_mb}MB`}
                subtitle="Auto-scaling"
                icon={CircleStackIcon}
                color="from-orange-500 to-red-600"
                trend="up"
              />
            </div>

            {/* Detailed Performance Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                  <CpuChipIcon className="h-6 w-6 mr-2 text-blue-400" />
                  Query Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Average Query Time</span>
                    <span className="text-green-400 font-mono font-bold">
                      {performanceData.performance.avg_query_ms}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Vector Embeddings</span>
                    <span className="text-blue-400 font-mono font-bold">1,536-dim</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Patterns Analyzed</span>
                    <span className="text-purple-400 font-mono font-bold">
                      {performanceData.database_stats.total_patterns_stored.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                  <ServerIcon className="h-6 w-6 mr-2 text-emerald-400" />
                  Serverless Infrastructure
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Current Capacity</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {performanceData.serverless_metrics.current_capacity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Auto-Scaling</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-bold">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Availability</span>
                    <span className="text-blue-400 font-mono font-bold">
                      {performanceData.serverless_metrics.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Explainability Tab */}
        {activeTab === 'ai' && explainabilityData && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* AI Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Similarity Score"
                value={`${(explainabilityData.ai_explainability.model_performance.avg_similarity_score * 100).toFixed(1)}%`}
                subtitle="Pattern matching accuracy"
                icon={LightBulbIcon}
                color="from-cyan-500 to-blue-600"
                trend="up"
              />
              <MetricCard
                title="Confidence Level"
                value={`${(explainabilityData.ai_explainability.model_performance.avg_confidence_level * 100).toFixed(1)}%`}
                subtitle="AI decision confidence"
                icon={CheckCircleIcon}
                color="from-emerald-500 to-green-600"
                trend="up"
              />
              <MetricCard
                title="Prediction Accuracy"
                value={`${explainabilityData.ai_explainability.model_performance.prediction_accuracy}%`}
                subtitle="Clinical validation"
                icon={ChartBarIcon}
                color="from-purple-500 to-indigo-600"
                trend="up"
              />
              <MetricCard
                title="False Positives"
                value={`${explainabilityData.ai_explainability.model_performance.false_positive_rate}%`}
                subtitle="Error rate (lower is better)"
                icon={ClockIcon}
                color="from-red-500 to-pink-600"
                trend="down"
              />
            </div>

            {/* Recent AI Decisions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />
                Recent AI Decisions & Reasoning
              </h3>
              <div className="space-y-4">
                {explainabilityData.ai_explainability.recent_decisions.slice(0, 3).map((decision: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border-l-4 border-blue-400"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-blue-400 font-semibold text-sm">
                          {decision.pattern_type.toUpperCase()}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(decision.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono text-sm">
                          Similarity: {(decision.vector_similarity_score * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-300 font-mono text-xs">
                          Confidence: {(decision.confidence_level * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm mb-3">{decision.ai_reasoning}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {decision.medical_factors.map((factor: string, idx: number) => (
                        <div key={idx} className="text-xs text-gray-400 bg-white/5 rounded px-2 py-1">
                          {factor}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vector Search Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4">Vector Analysis Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Embedding Dimensions</span>
                    <span className="text-cyan-400 font-mono">
                      {explainabilityData.ai_explainability.vector_search_details.embedding_dimensions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Similarity Metric</span>
                    <span className="text-blue-400 font-mono">
                      {explainabilityData.ai_explainability.vector_search_details.similarity_metric}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Patterns Compared</span>
                    <span className="text-purple-400 font-mono">
                      {explainabilityData.ai_explainability.vector_search_details.historical_patterns_compared}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4">Feature Weights</h3>
                <div className="space-y-3">
                  {Object.entries(explainabilityData.ai_explainability.vector_search_details.feature_weights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-green-400 font-mono">{((value as number) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(value as number) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Healthcare ROI Tab */}
        {activeTab === 'roi' && roiData && (
          <motion.div
            key="roi"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* ROI Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Monthly Savings"
                value={`$${roiData.healthcare_roi.cost_reduction.monthly_savings_per_patient.toLocaleString()}`}
                subtitle="Per patient cost reduction"
                icon={CurrencyDollarIcon}
                color="from-emerald-500 to-green-600"
                trend="up"
              />
              <MetricCard
                title="Crisis Prevention"
                value={`${roiData.healthcare_roi.clinical_outcomes.crisis_prevention_rate}%`}
                subtitle="Events prevented successfully"
                icon={HeartIcon}
                color="from-blue-500 to-cyan-600"
                trend="up"
              />
              <MetricCard
                title="Family Satisfaction"
                value={`${roiData.healthcare_roi.family_experience.satisfaction_score}%`}
                subtitle="+25 point improvement"
                icon={CheckCircleIcon}
                color="from-purple-500 to-pink-600"
                trend="up"
              />
              <MetricCard
                title="Clinical Hours Saved"
                value={`${roiData.healthcare_roi.provider_efficiency.monitoring_time_reduction_hours}`}
                subtitle="Monthly efficiency gain"
                icon={ClockIcon}
                color="from-orange-500 to-red-600"
                trend="up"
              />
            </div>

            {/* Business Impact Summary */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-emerald-400" />
                Primary Business Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="text-emerald-200 text-sm">Total Healthcare Savings</div>
                  <div className="text-white text-2xl font-bold">
                    {roiData.business_impact_summary.primary_value}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-blue-200 text-sm">Crisis Prevention Value</div>
                  <div className="text-white text-2xl font-bold">
                    {roiData.business_impact_summary.crisis_prevention_value}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed ROI Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4 text-center">Clinical Outcomes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Early Intervention</span>
                    <span className="text-green-400 font-bold">
                      {roiData.healthcare_roi.clinical_outcomes.early_intervention_success}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Readmission Reduction</span>
                    <span className="text-blue-400 font-bold">
                      {roiData.healthcare_roi.clinical_outcomes.hospital_readmission_reduction}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Medication Adherence</span>
                    <span className="text-purple-400 font-bold">
                      +{roiData.healthcare_roi.clinical_outcomes.medication_adherence_improvement}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4 text-center">Family Experience</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Communication Increase</span>
                    <span className="text-emerald-400 font-bold">
                      +{roiData.healthcare_roi.family_experience.communication_frequency_increase}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Care Coordination</span>
                    <span className="text-blue-400 font-bold">
                      {roiData.healthcare_roi.family_experience.care_coordination_rating}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Stress Reduction</span>
                    <span className="text-purple-400 font-bold">
                      {roiData.healthcare_roi.family_experience.stress_reduction_reported}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-lg font-bold mb-4 text-center">System Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Response Time</span>
                    <span className="text-green-400 font-bold">
                      {roiData.healthcare_roi.system_performance.average_response_time_minutes}min
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">System Uptime</span>
                    <span className="text-blue-400 font-bold">
                      {roiData.healthcare_roi.system_performance.system_uptime_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 text-sm">Data Accuracy</span>
                    <span className="text-purple-400 font-bold">
                      {roiData.healthcare_roi.system_performance.data_accuracy_rate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalDashboard;