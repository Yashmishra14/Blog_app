// AI Dashboard - All AI features ka central hub
// Ye component mein hum sab AI features ko organize karenge

import React, { useState } from 'react';
import AIVlogGenerator from './AIVlogGenerator';

const AIDashboard = () => {
    // State for active feature - kaun sa feature currently active hai
    const [activeFeature, setActiveFeature] = useState('overview');

    // Available features - kya kya features available hain
    const features = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'vlog', name: 'Vlog Generation', icon: '📹' },
        { id: 'content', name: 'Content Ideas', icon: '💡' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Main Heading */}
                <h1 className="text-3xl font-bold text-center mb-8">🤖 AI Content Studio</h1>
                
                {/* Feature Navigation - different features ke liye buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {features.map(feature => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveFeature(feature.id)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                activeFeature === feature.id
                                    ? 'bg-blue-600 text-white' // Active state
                                    : 'bg-white text-gray-700 hover:bg-gray-100' // Normal state
                            }`}
                        >
                            <span className="mr-2">{feature.icon}</span>
                            {feature.name}
                        </button>
                    ))}
                </div>

                {/* Feature Content - selected feature ka content show karta hai */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Overview Tab */}
                    {activeFeature === 'overview' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Welcome to AI Content Studio</h2>
                            <p className="text-gray-600 mb-6">
                                Generate amazing vlog content for your blog using AI technology
                            </p>
                            
                            {/* Feature Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">📹 Vlog Generation</h3>
                                    <p className="text-sm text-gray-600">
                                        Generate vlog scripts, ideas, and thumbnail concepts using AI
                                    </p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">💡 Content Ideas</h3>
                                    <p className="text-sm text-gray-600">
                                        Get creative vlog ideas and content suggestions for your channel
                                    </p>
                                </div>
                            </div>

                            {/* Quick Start Guide */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Quick Start Guide:</h3>
                                <ol className="text-left text-sm text-gray-700 space-y-1">
                                    <li>1. Click on "Vlog Generation" to start creating content</li>
                                    <li>2. Enter your vlog topic and select preferences</li>
                                    <li>3. Choose between Script, Ideas, or Thumbnail generation</li>
                                    <li>4. Click generate and get AI-powered content!</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* Vlog Generation Tab */}
                    {activeFeature === 'vlog' && <AIVlogGenerator />}
                    
                    {/* Content Ideas Tab - Future feature */}
                    {activeFeature === 'content' && (
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Content Ideas Coming Soon!</h2>
                            <p className="text-gray-600 mb-4">
                                We're working on AI-powered content suggestions and blog post generation.
                            </p>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Coming Features:</strong> Blog post ideas, SEO optimization, 
                                    content calendar suggestions, and more!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Powered by Google Gemini AI • Free to use with generous limits</p>
                </div>
            </div>
        </div>
    );
};

export default AIDashboard;
