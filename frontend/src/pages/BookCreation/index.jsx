import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NewProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    bookType: 'novel',
    targetAudience: '',
    description: '',
    mainCharacters: '',
    setting: '',
    tone: 'neutral',
    style: '',
    plotOutline: '',
    chapterStructure: '',
    coverPrompt: '',
    useAIAssistance: true,
  });

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
    'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
    'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'
  ];

  const bookTypes = [
    { id: 'novel', label: 'Novel' },
    { id: 'short-story', label: 'Short Story' },
    { id: 'non-fiction', label: 'Non-Fiction Book' },
    { id: 'poetry', label: 'Poetry Collection' }
  ];

  const audiences = [
    'Children (Ages 5-8)', 'Middle Grade (Ages 9-12)', 'Young Adult (Ages 13-18)',
    'Adults', 'Professionals', 'Academic', 'General Audience'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send data to your API and create a new project
    console.log("Creating new project with data:", formData);
    
    // Mock success - replace with actual API call
    setTimeout(() => {
      // Redirect to the editor for the new project
      navigate('/editor/new');
    }, 1000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-100 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Book Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">Genre *</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100"
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Book Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {bookTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      formData.bookType === type.id 
                        ? 'border-blue-600 bg-blue-800 text-blue-100' 
                        : 'border-gray-700 hover:border-blue-500 bg-gray-800 text-gray-300'
                    }`}
                    onClick={() => setFormData({...formData, bookType: type.id})}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Target Audience *</label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100"
                required
              >
                <option value="">Select Target Audience</option>
                {audiences.map(audience => (
                  <option key={audience} value={audience}>{audience}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Book Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-32 bg-gray-800 text-gray-100"
                placeholder="Describe what your book is about..."
                required
              ></textarea>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-100 mb-6">Book Details</h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Main Characters</label>
              <textarea
                name="mainCharacters"
                value={formData.mainCharacters}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-32 bg-gray-800 text-gray-100"
                placeholder="Describe your main characters and their attributes..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Setting</label>
              <textarea
                name="setting"
                value={formData.setting}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-32 bg-gray-800 text-gray-100"
                placeholder="Describe the world, time period, or environment of your book..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Tone</label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100"
                >
                  <option value="neutral">Neutral</option>
                  <option value="serious">Serious</option>
                  <option value="humorous">Humorous</option>
                  <option value="dark">Dark</option>
                  <option value="optimistic">Optimistic</option>
                  <option value="nostalgic">Nostalgic</option>
                  <option value="suspenseful">Suspenseful</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">Writing Style</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100"
                  placeholder="e.g., Conversational, Formal, Poetic..."
                />
              </div>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-100 mb-6">Content Planning</h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Plot Outline</label>
              <textarea
                name="plotOutline"
                value={formData.plotOutline}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-32 bg-gray-800 text-gray-100"
                placeholder="Outline the major plot points of your book..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Chapter Structure</label>
              <textarea
                name="chapterStructure"
                value={formData.chapterStructure}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-32 bg-gray-800 text-gray-100"
                placeholder="Describe how you want to structure your chapters..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Cover Image Prompt</label>
              <textarea
                name="coverPrompt"
                value={formData.coverPrompt}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded px-3 py-2 h-24 bg-gray-800 text-gray-100"
                placeholder="Describe your ideal book cover for AI generation..."
              ></textarea>
              <p className="text-sm text-gray-400 mt-1">This will be used to generate your cover image</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useAIAssistance"
                  name="useAIAssistance"
                  checked={formData.useAIAssistance}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="useAIAssistance" className="ml-2 block text-gray-300">
                  Use AI to help expand and enhance my project based on my inputs
                </label>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Create New Book Project</h1>
          <p className="text-gray-400 mb-6">Fill in the details below to start your new book project</p>
          
          {/* Progress Steps */}
          <div className="flex mb-8">
            <div className="flex-1">
              <div className={`h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className="flex justify-center mt-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  1
                </div>
              </div>
              <p className="text-center text-sm mt-1 text-gray-300">Basics</p>
            </div>
            <div className="flex-1">
              <div className={`h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className="flex justify-center mt-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  2
                </div>
              </div>
              <p className="text-center text-sm mt-1 text-gray-300">Details</p>
            </div>
            <div className="flex-1">
              <div className={`h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className="flex justify-center mt-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  3
                </div>
              </div>
              <p className="text-center text-sm mt-1 text-gray-300">Plan</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-700"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create Project
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Tips Panel */}
        <div className="bg-blue-900 rounded-lg p-6">
          <h3 className="font-bold text-gray-100 mb-2">Tips for Creating a Great Book Project</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Be as detailed as possible in your descriptions for better AI generation</li>
            <li>• Include character motivations and conflicts to create more engaging stories</li>
            <li>• Consider your target audience when defining tone and style</li>
            <li>• You can always edit and refine your project details later</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NewProject;