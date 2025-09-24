// AI Vlog Generator Component - AI se vlog content generate karta hai
// Ye component mein hum vlog scripts, ideas aur thumbnails generate karenge

import React, { useState } from 'react';
import ApiService from '../../service/api';

const AIVlogGenerator = () => {
    // State variables - component ki current state track karta hai
    const [activeTab, setActiveTab] = useState('script'); // Kaun sa tab active hai
    const [formData, setFormData] = useState({
        topic: '', // Vlog ka topic
        duration: '5-10', // Kitna time ka vlog
        style: 'casual', // Kaun sa style
        targetAudience: 'general', // Kaun dekh sakta hai
        category: 'lifestyle' // Kaun sa category
    });
    const [isGenerating, setIsGenerating] = useState(false); // Loading state
    const [results, setResults] = useState(null); // AI results
    const [error, setError] = useState(''); // Error messages

    // Options for dropdowns - dropdown mein kya kya options honge
    const durations = ['3-5', '5-10', '10-15', '15-20', '20+'];
    const styles = ['casual', 'professional', 'educational', 'entertaining', 'dramatic'];
    const audiences = ['general', 'teens', 'adults', 'professionals', 'students', 'parents'];
    const categories = ['lifestyle', 'tech', 'food', 'travel', 'fashion', 'business', 'education', 'entertainment'];

    // Vlog script generate karta hai
    const handleGenerateScript = async (e) => {
        e.preventDefault(); // Page reload nahi hoga
        setIsGenerating(true); // Loading start karta hai
        setError(''); // Error clear karta hai

        try {
            // API call karta hai server pe
            const response = await ApiService.generateVlogScript(formData);
            
            if (response?.isSuccess) {
                setResults({ type: 'script', data: response.data });
                alert('Vlog script generated successfully!');
            } else {
                setError(response?.message || 'Failed to generate script');
            }
        } catch (err) {
            console.error('Error generating script:', err);
            setError('Error generating script');
        } finally {
            setIsGenerating(false); // Loading stop karta hai
        }
    };

    // Vlog ideas generate karta hai
    const handleGenerateIdeas = async () => {
        setIsGenerating(true);
        setError('');

        try {
            const response = await ApiService.generateVlogIdeas({
                category: formData.category,
                count: 5
            });
            
            if (response?.isSuccess) {
                setResults({ type: 'ideas', data: response.data });
                alert('Vlog ideas generated successfully!');
            } else {
                setError(response?.message || 'Failed to generate ideas');
            }
        } catch (err) {
            console.error('Error generating ideas:', err);
            setError('Error generating ideas');
        } finally {
            setIsGenerating(false);
        }
    };

    // Thumbnail ideas generate karta hai
    const handleGenerateThumbnails = async () => {
        if (!formData.topic) {
            setError('Please enter a vlog topic first');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const response = await ApiService.generateThumbnailIdeas({
                vlogTitle: formData.topic,
                style: formData.style
            });
            
            if (response?.isSuccess) {
                setResults({ type: 'thumbnails', data: response.data });
                alert('Thumbnail ideas generated successfully!');
            } else {
                setError(response?.message || 'Failed to generate thumbnail ideas');
            }
        } catch (err) {
            console.error('Error generating thumbnails:', err);
            setError('Error generating thumbnail ideas');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6">📹 AI Vlog Generator</h3>
            
            {/* Tab Navigation - different features ke liye tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('script')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'script' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Generate Script
                </button>
                <button
                    onClick={() => setActiveTab('ideas')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'ideas' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Vlog Ideas
                </button>
                <button
                    onClick={() => setActiveTab('thumbnails')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'thumbnails' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Thumbnail Ideas
                </button>
            </div>

            {/* Form - user input ke liye */}
            <form onSubmit={handleGenerateScript} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Topic Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Topic/Title
                        </label>
                        <input
                            type="text"
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            placeholder="Enter your vlog topic..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Duration Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                        </label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {durations.map(d => (
                                <option key={d} value={d}>{d} minutes</option>
                            ))}
                        </select>
                    </div>

                    {/* Style Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Style
                        </label>
                        <select
                            value={formData.style}
                            onChange={(e) => setFormData({...formData, style: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {styles.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Target Audience Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Audience
                        </label>
                        <select
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {audiences.map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons - different tabs ke liye different buttons */}
                <div className="flex space-x-4">
                    {activeTab === 'script' && (
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Script'}
                        </button>
                    )}
                    
                    {activeTab === 'ideas' && (
                        <button
                            type="button"
                            onClick={handleGenerateIdeas}
                            disabled={isGenerating}
                            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Ideas'}
                        </button>
                    )}
                    
                    {activeTab === 'thumbnails' && (
                        <button
                            type="button"
                            onClick={handleGenerateThumbnails}
                            disabled={isGenerating || !formData.topic}
                            className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Thumbnails'}
                        </button>
                    )}
                </div>
            </form>

            {/* Error Display - agar koi error aaye to */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Results Display - AI results show karta hai */}
            {results && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3">
                        {results.type === 'script' && 'Generated Script'}
                        {results.type === 'ideas' && 'Vlog Ideas'}
                        {results.type === 'thumbnails' && 'Thumbnail Ideas'}
                    </h4>
                    
                    {/* Script Results */}
                    {results.type === 'script' && (
                        <div className="space-y-4">
                            <div className="text-sm text-gray-600">
                                <p><strong>Duration:</strong> {results.data.estimatedDuration} minutes</p>
                                <p><strong>Word Count:</strong> {results.data.wordCount} words</p>
                            </div>
                            <div className="prose max-w-none">
                                <pre className="whitespace-pre-wrap text-sm">{results.data.fullScript}</pre>
                            </div>
                        </div>
                    )}
                    
                    {/* Ideas Results */}
                    {results.type === 'ideas' && (
                        <div className="space-y-3">
                            {results.data.ideas.map((idea, index) => (
                                <div key={index} className="p-3 bg-white rounded border">
                                    <h5 className="font-semibold">{idea.title}</h5>
                                    <p className="text-sm text-gray-600">{idea.description}</p>
                                    <div className="text-xs text-gray-500 mt-1">
                                        <span>Audience: {idea.audience}</span>
                                        <span className="ml-4">Duration: {idea.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Thumbnail Results */}
                    {results.type === 'thumbnails' && (
                        <div className="space-y-3">
                            {results.data.thumbnailIdeas.map((idea, index) => (
                                <div key={index} className="p-3 bg-white rounded border">
                                    <h5 className="font-semibold">{idea.concept}</h5>
                                    <p className="text-sm"><strong>Visual:</strong> {idea.visual}</p>
                                    <p className="text-sm"><strong>Text:</strong> {idea.text}</p>
                                    <p className="text-sm"><strong>Colors:</strong> {idea.colors}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIVlogGenerator;
