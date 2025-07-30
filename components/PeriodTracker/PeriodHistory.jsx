
"use client";
import React from 'react';
import Link from 'next/link';
import { Brain, FileText, ShoppingBag, ArrowRight, MessageSquareHeart, Shield, Clock, Star } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 md:px-6 py-20 mt-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MindBridge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your complete mental wellness platform. Choose your path to better mental health.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">100% Confidential</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">24/7 Available</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-medium">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Main Services - 3 Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          
          {/* Mental Counselor */}
          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mental Counselor</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Talk to our AI-powered counselor anytime. Get personalized guidance, emotional support, and professional mental health assistance.
              </p>
              
              <Link href="/mental-counselor" className="block">
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <MessageSquareHeart className="w-5 h-5" />
                  <span>Start Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          </div>

          {/* Reports Analyzer */}
          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-300 transition-all duration-500 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports Analyzer</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Track your mental health journey with detailed analytics, mood patterns, and AI-powered insights for better self-awareness.
              </p>
              
              <Link href="/reports" className="block">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <FileText className="w-5 h-5" />
                  <span>Analyze Reports</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          </div>

          {/* Pharmacy */}
          <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-500 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wellness Pharmacy</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access trusted wellness products, supplements, and medications recommended by certified mental health professionals.
              </p>
              
              <Link href="/pharmacy" className="block">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Browse Store</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600"></div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Our AI-powered platform is here to support you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <MessageSquareHeart className="w-5 h-5" />
                <span>Start Free Session</span>
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
