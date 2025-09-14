import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRightIcon,
  PlayIcon,
  CheckIcon,
  SparklesIcon,
  CpuChipIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: '94%', label: 'Crisis Prevention Rate' },
    { value: '$1.2M', label: 'Annual Savings' },
    { value: '<3min', label: 'Response Time' },
    { value: '847', label: 'Patients Monitored' }
  ];

  const features = [
    {
      icon: CpuChipIcon,
      title: 'Multi-Agent AI Coordination',
      description: '7 specialized AI agents working together to provide comprehensive neurodegenerative care management.',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: BoltIcon,
      title: 'Predictive Crisis Prevention',
      description: 'Advanced pattern recognition detects potential crises 3-7 days before they occur, enabling proactive intervention.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'TiDB Serverless Vector Search',
      description: 'Real-time medical literature analysis and vector similarity search for evidence-based care recommendations.',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      company: 'Regional Medical Center',
      quote: 'SynapseGuard has transformed how we approach neurodegenerative care. The predictive capabilities are remarkable.'
    },
    {
      name: 'Margaret Wilson',
      role: 'Patient',
      company: 'Living with Early-Stage Dementia',
      quote: 'I feel more secure knowing that AI is helping monitor my health and keeping my family informed.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Healthcare Administrator',
      company: 'Metro Health System',
      quote: 'The cost savings and improved outcomes speak for themselves. This is the future of healthcare.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/10 mb-8">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Production AI System • Live Demo Available
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The Future of{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Neurodegenerative
                </span>{' '}
                Care
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg">
                Multi-agent AI system that predicts and prevents healthcare crises 3-7 days before they occur. 
                Transform patient outcomes with intelligent care coordination.
              </p>

              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  to="/live-demo"
                  className="group inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <PlayIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Experience Live Demo
                </Link>
                <Link
                  to="/provider"
                  className="inline-flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  View Provider Dashboard 
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className={`mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="w-[76rem] h-[45rem] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Dashboard Header */}
                  <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">SynapseGuard Dashboard</div>
                        <div className="text-sm text-gray-500">Real-time AI Healthcare Monitoring</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="flex-1 p-6">
                    <div className="grid grid-cols-4 gap-6 mb-6">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="text-2xl font-bold text-blue-600">847</div>
                        <div className="text-sm text-blue-700">Patients Monitored</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-sm text-green-700">Prevention Rate</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">&lt;3min</div>
                        <div className="text-sm text-purple-700">Response Time</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <div className="text-2xl font-bold text-orange-600">$1.2M</div>
                        <div className="text-sm text-orange-700">Annual Savings</div>
                      </div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Real-time Analytics</h3>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-48 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                        {[40, 65, 30, 80, 45, 90, 35, 70, 55, 85, 25, 75].map((height, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t opacity-80"
                            style={{ 
                              height: `${height}%`, 
                              width: '20px',
                              animationDelay: `${i * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Production Results</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Proven Impact Across Healthcare Systems
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5 transform transition-all duration-500 delay-${index * 100} hover:shadow-lg hover:-translate-y-1`}
              >
                <dt className="text-sm font-medium leading-6 text-gray-600">{stat.label}</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Advanced AI Technology</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for intelligent healthcare
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our multi-agent AI system combines cutting-edge technology with clinical expertise to deliver unparalleled care coordination.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className={`group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 delay-${index * 100}`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5 hover:shadow-xl hover:ring-gray-900/10 transition-all duration-300">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <dt className="mt-6 text-xl font-semibold leading-7 text-gray-900 group-hover:text-gray-700 transition-colors">
                      {feature.title}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by healthcare professionals and patients
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name} 
                  className={`bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5 transform transition-all duration-500 delay-${index * 100} hover:shadow-lg hover:-translate-y-1`}
                >
                  <blockquote className="text-gray-900">
                    <p className="text-sm leading-6">"{testimonial.quote}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </figcaption>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to transform healthcare?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join leading healthcare systems already using SynapseGuard to prevent crises and save lives.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/live-demo"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Free Demo
              </Link>
              <Link 
                to="/admin" 
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                View Admin Dashboard <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;