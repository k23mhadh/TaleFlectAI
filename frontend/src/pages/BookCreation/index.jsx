import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  MapPin,
  Target,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

// Constants
const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'Self-Help'];
const BOOK_TYPES = [
  { id: 'novel', label: 'Novel' },
  { id: 'short-story', label: 'Short Story' },
  { id: 'poetry', label: 'Poetry' },
  { id: 'non-fiction', label: 'Non-Fiction' }
];
const TARGET_AUDIENCES = ['Children', 'Young Adult', 'Adult', 'All Ages'];
const TONES = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'humorous', label: 'Humorous' },
  { id: 'serious', label: 'Serious' },
  { id: 'dramatic', label: 'Dramatic' }
];

const BookCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Main book data
  const [bookData, setBookData] = useState({
    title: '',
    genre: '',
    bookType: 'novel',
    targetAudience: '',
    description: '',
    tone: 'neutral',
    style: 'narrative',
    outline: '',
    coverPrompt: '',
    visibility: 'private',
    useAI: true,
  });

  // Dynamic arrays
  const [characters, setCharacters] = useState([]);
  const [settings, setSettings] = useState([]);
  const [plotPoints, setPlotPoints] = useState([]);
  const [chapterTitles, setChapterTitles] = useState([]);

  // Temp inputs for adding items
  const [tempInputs, setTempInputs] = useState({
    characterName: '',
    characterRole: '',
    characterDescription: '',
    settingName: '',
    settingDescription: '',
    settingType: 'location',
    plotTitle: '',
    plotDescription: '',
    chapterTitle: ''
  });

  const totalSteps = 4;

  // Auto-save function
  const saveToLocalStorage = async () => {
    if (!bookData.title.trim()) return; // Don't save empty drafts
    
    setIsAutoSaving(true);
    
    try {
      const draftData = {
        bookData,
        characters,
        settings,
        plotPoints,
        chapterTitles,
        currentStep,
        timestamp: new Date().toISOString()
      };
      
      // In artifacts, we'll simulate localStorage
      // In real app: localStorage.setItem('bookCreationDraft', JSON.stringify(draftData));
      console.log('Auto-saving draft...', draftData);
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (bookData.title.trim()) {
        saveToLocalStorage();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [bookData.title]); // Only depend on title to avoid excessive re-runs

  // Load draft on mount
  useEffect(() => {
    try {
      // In real app: const draft = localStorage.getItem('bookCreationDraft');
      // For demo, we'll skip the actual loading
      console.log('Checking for saved draft...');
      
      // Simulate checking for draft
      // if (draft) {
      //   const savedData = JSON.parse(draft);
      //   // Load saved data...
      // }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, []);

  // Auto-save when important data changes (debounced)
  useEffect(() => {
    if (!bookData.title.trim()) return;
    
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 3000); // Save 3 seconds after changes

    return () => clearTimeout(timeoutId);
  }, [bookData, characters, settings, plotPoints, chapterTitles]);

  const handleInputChange = (field, value) => {
    setBookData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any existing error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTempInputChange = (field, value) => {
    setTempInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!bookData.title.trim()) {
        newErrors.title = 'Book title is required';
      }
      if (!bookData.genre) {
        newErrors.genre = 'Please select a genre';
      }
      if (!bookData.targetAudience) {
        newErrors.targetAudience = 'Please select a target audience';
      }
      if (!bookData.description.trim()) {
        newErrors.description = 'Book description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Character management
  const addCharacter = () => {
    if (!tempInputs.characterName.trim() || !tempInputs.characterRole.trim()) {
      return;
    }

    const newCharacter = {
      id: Date.now(),
      name: tempInputs.characterName.trim(),
      role: tempInputs.characterRole.trim(),
      description: tempInputs.characterDescription.trim()
    };

    setCharacters(prev => [...prev, newCharacter]);
    setTempInputs(prev => ({
      ...prev,
      characterName: '',
      characterRole: '',
      characterDescription: ''
    }));
  };

  const removeCharacter = (id) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
  };

  // Setting management
  const addSetting = () => {
    if (!tempInputs.settingName.trim()) {
      return;
    }

    const newSetting = {
      id: Date.now(),
      name: tempInputs.settingName.trim(),
      description: tempInputs.settingDescription.trim(),
      type: tempInputs.settingType
    };

    setSettings(prev => [...prev, newSetting]);
    setTempInputs(prev => ({
      ...prev,
      settingName: '',
      settingDescription: '',
      settingType: 'location'
    }));
  };

  const removeSetting = (id) => {
    setSettings(prev => prev.filter(setting => setting.id !== id));
  };

  // Plot point management
  const addPlotPoint = () => {
    if (!tempInputs.plotTitle.trim()) {
      return;
    }

    const newPlotPoint = {
      id: Date.now(),
      title: tempInputs.plotTitle.trim(),
      description: tempInputs.plotDescription.trim(),
      order: plotPoints.length + 1
    };

    setPlotPoints(prev => [...prev, newPlotPoint]);
    setTempInputs(prev => ({
      ...prev,
      plotTitle: '',
      plotDescription: ''
    }));
  };

  const removePlotPoint = (id) => {
    setPlotPoints(prev => prev.filter(point => point.id !== id));
  };

  // Chapter management
  const addChapterTitle = () => {
    if (!tempInputs.chapterTitle.trim()) {
      return;
    }

    setChapterTitles(prev => [...prev, tempInputs.chapterTitle.trim()]);
    setTempInputs(prev => ({ ...prev, chapterTitle: '' }));
  };

  const removeChapterTitle = (index) => {
    setChapterTitles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalBookData = {
        ...bookData,
        characters,
        settings,
        plotPoints,
        chapterTitles
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Book created:', finalBookData);
      alert('Book created successfully!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="mx-auto text-blue-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Basic Information</h2>
              <p className="text-gray-400">Let's start with the essential details about your book</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={bookData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Enter your book title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Genre *
                </label>
                <select
                  value={bookData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.genre ? 'border-red-500' : 'border-gray-700'
                  }`}
                >
                  <option value="">Select Genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.genre}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-3">
                Book Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BOOK_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('bookType', type.id)}
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                      bookData.bookType === type.id 
                        ? 'border-blue-500 bg-blue-900/30 text-blue-100' 
                        : 'border-gray-700 hover:border-blue-500 bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Target Audience *
              </label>
              <select
                value={bookData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.targetAudience ? 'border-red-500' : 'border-gray-700'
                }`}
              >
                <option value="">Select Target Audience</option>
                {TARGET_AUDIENCES.map(audience => (
                  <option key={audience} value={audience}>{audience}</option>
                ))}
              </select>
              {errors.targetAudience && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.targetAudience}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Book Description *
              </label>
              <textarea
                value={bookData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 h-32 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Describe what your book is about..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Tone
                </label>
                <select
                  value={bookData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {TONES.map(tone => (
                    <option key={tone.id} value={tone.id}>{tone.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Writing Style
                </label>
                <input
                  type="text"
                  value={bookData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Conversational, Formal, Poetic..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="mx-auto text-green-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Characters & Settings</h2>
              <p className="text-gray-400">Build the world and people of your story</p>
            </div>

            {/* Characters Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                <Users className="mr-2 text-blue-400" size={20} />
                Characters
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={tempInputs.characterName}
                    onChange={(e) => handleTempInputChange('characterName', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Character name"
                    onKeyPress={(e) => e.key === 'Enter' && addCharacter()}
                  />
                  
                  <input
                    type="text"
                    value={tempInputs.characterRole}
                    onChange={(e) => handleTempInputChange('characterRole', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Role (e.g., Protagonist, Villain)"
                    onKeyPress={(e) => e.key === 'Enter' && addCharacter()}
                  />
                  
                  <button
                    onClick={addCharacter}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Character
                  </button>
                </div>
                
                <textarea
                  value={tempInputs.characterDescription}
                  onChange={(e) => handleTempInputChange('characterDescription', e.target.value)}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Character description (optional)"
                  rows="2"
                />
                
                {characters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-200">Added Characters:</h4>
                    {characters.map((character) => (
                      <div key={character.id} className="flex items-start justify-between bg-gray-700 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-100">{character.name}</span>
                            <span className="text-gray-400 text-sm">({character.role})</span>
                          </div>
                          {character.description && (
                            <p className="text-sm text-gray-300 mt-1">{character.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeCharacter(character.id)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                <MapPin className="mr-2 text-green-400" size={20} />
                Settings
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={tempInputs.settingName}
                    onChange={(e) => handleTempInputChange('settingName', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Setting name"
                    onKeyPress={(e) => e.key === 'Enter' && addSetting()}
                  />
                  
                  <select
                    value={tempInputs.settingType}
                    onChange={(e) => handleTempInputChange('settingType', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="location">Location</option>
                    <option value="time-period">Time Period</option>
                    <option value="world">World</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <input
                    type="text"
                    value={tempInputs.settingDescription}
                    onChange={(e) => handleTempInputChange('settingDescription', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Description (optional)"
                    onKeyPress={(e) => e.key === 'Enter' && addSetting()}
                  />
                  
                  <button
                    onClick={addSetting}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Setting
                  </button>
                </div>
                
                {settings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-200">Added Settings:</h4>
                    {settings.map((setting) => (
                      <div key={setting.id} className="flex items-start justify-between bg-gray-700 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-100">{setting.name}</span>
                            <span className="text-gray-400 text-sm capitalize">({setting.type})</span>
                          </div>
                          {setting.description && (
                            <p className="text-sm text-gray-300 mt-1">{setting.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeSetting(setting.id)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="mx-auto text-purple-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Plot & Structure</h2>
              <p className="text-gray-400">Plan your story's structure and key moments</p>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Plot Outline
              </label>
              <textarea
                value={bookData.outline}
                onChange={(e) => handleInputChange('outline', e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 h-32 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Outline the major plot points and story structure..."
              />
            </div>

            {/* Plot Points */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                <Target className="mr-2 text-purple-400" size={20} />
                Key Plot Points
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={tempInputs.plotTitle}
                    onChange={(e) => handleTempInputChange('plotTitle', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Plot point title"
                    onKeyPress={(e) => e.key === 'Enter' && addPlotPoint()}
                  />
                  
                  <input
                    type="text"
                    value={tempInputs.plotDescription}
                    onChange={(e) => handleTempInputChange('plotDescription', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                    onKeyPress={(e) => e.key === 'Enter' && addPlotPoint()}
                  />
                  
                  <button
                    onClick={addPlotPoint}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Plot Point
                  </button>
                </div>
                
                {plotPoints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-200">Plot Points:</h4>
                    {plotPoints.map((point, index) => (
                      <div key={point.id} className="flex items-start justify-between bg-gray-700 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-100">{point.title}</span>
                          </div>
                          {point.description && (
                            <p className="text-sm text-gray-300 mt-1 ml-8">{point.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removePlotPoint(point.id)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chapter Structure */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                <FileText className="mr-2 text-yellow-400" size={20} />
                Chapter Structure
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={tempInputs.chapterTitle}
                    onChange={(e) => handleTempInputChange('chapterTitle', e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Chapter title"
                    onKeyPress={(e) => e.key === 'Enter' && addChapterTitle()}
                  />
                  
                  <button
                    onClick={addChapterTitle}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Chapter
                  </button>
                </div>
                
                {chapterTitles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-200">Chapter Titles:</h4>
                    {chapterTitles.map((title, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-100">
                          Chapter {index + 1}: {title}
                        </span>
                        <button
                          onClick={() => removeChapterTitle(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="mx-auto text-yellow-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Final Settings</h2>
              <p className="text-gray-400">Configure AI assistance and publishing options</p>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Cover Image Prompt
              </label>
              <textarea
                value={bookData.coverPrompt}
                onChange={(e) => handleInputChange('coverPrompt', e.target.value)}
                className="w-full border border-gray-700 rounded-lg px-4 py-3 h-24 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Describe your ideal book cover for AI generation..."
              />
              <p className="text-sm text-gray-400 mt-1">This will be used to generate your cover image</p>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Visibility
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'private', label: 'Private', icon: EyeOff, desc: 'Only you can see this book' },
                  { id: 'unlisted', label: 'Unlisted', icon: Eye, desc: 'Accessible via link only' },
                  { id: 'public', label: 'Public', icon: Eye, desc: 'Visible to everyone' }
                ].map(option => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleInputChange('visibility', option.id)}
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                        bookData.visibility === option.id 
                          ? 'border-blue-500 bg-blue-900/30 text-blue-100' 
                          : 'border-gray-700 hover:border-blue-500 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent className="mx-auto mb-2" size={24} />
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs mt-1 opacity-75">{option.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
              <input
                type="checkbox"
                id="useAI"
                checked={bookData.useAI}
                onChange={(e) => handleInputChange('useAI', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
              />
              <Sparkles className="text-blue-400" size={20} />
              <div className="flex-1">
                <label htmlFor="useAI" className="text-gray-300 font-medium cursor-pointer">
                  Enable AI Assistance
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Use AI to help expand and enhance your project based on your inputs
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Project Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Title:</span>
                  <span className="text-gray-100 ml-2">{bookData.title || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-gray-100 ml-2">{bookData.genre || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-gray-100 ml-2 capitalize">{bookData.bookType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Audience:</span>
                  <span className="text-gray-100 ml-2">{bookData.targetAudience || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Characters:</span>
                  <span className="text-gray-100 ml-2">{characters.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Settings:</span>
                  <span className="text-gray-100 ml-2">{settings.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Plot Points:</span>
                  <span className="text-gray-100 ml-2">{plotPoints.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Chapters:</span>
                  <span className="text-gray-100 ml-2">{chapterTitles.length}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Create New Book Project</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-400">Step {currentStep} of {totalSteps}</p>
              
              {/* Auto-save status */}
              <div className="text-sm">
                {isAutoSaving ? (
                  <span className="text-yellow-400 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border border-yellow-400 border-t-transparent mr-2"></div>
                    Auto-saving...
                  </span>
                ) : lastSaved ? (
                  <span className="text-green-400">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                ) : bookData.title.trim() ? (
                  <span className="text-gray-400">
                    Auto-save enabled
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {bookData.title.trim() && (
              <button
                onClick={saveToLocalStorage}
                disabled={isAutoSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save Now
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all data?')) {
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="flex border-b border-gray-700">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => goToStep(step)}
                className={`flex-1 py-4 px-2 text-center font-medium transition-all ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-700 text-white hover:bg-green-600'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === currentStep ? 'bg-white text-blue-600' :
                    step < currentStep ? 'bg-white text-green-700' :
                    'bg-gray-600 text-gray-400'
                  }`}>
                    {step < currentStep ? <CheckCircle size={16} /> : step}
                  </div>
                  <span className="hidden sm:block">
                    {step === 1 && 'Basics'}
                    {step === 2 && 'Characters'}
                    {step === 3 && 'Plot'}
                    {step === 4 && 'Settings'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="mr-2" />
                Back
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="mr-2" />
                      Create Book
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tips Panel */}
        <div className="mt-6 bg-blue-900/20 rounded-lg p-6 border border-blue-700">
          <h3 className="font-bold text-gray-100 mb-3 flex items-center">
            <Sparkles className="mr-2 text-blue-400" />
            Tips for Step {currentStep}
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            {currentStep === 1 && (
              <>
                <li>• Choose a compelling title that reflects your book's theme</li>
                <li>• Be specific about your target audience for better AI assistance</li>
                <li>• Write a description that hooks readers in the first sentence</li>
                <li>• Your progress is automatically saved every 30 seconds and after changes</li>
              </>
            )}
            {currentStep === 2 && (
              <>
                <li>• Develop characters with clear motivations and conflicts</li>
                <li>• Include both main characters and important supporting roles</li>
                <li>• Describe settings that enhance your story's atmosphere</li>
              </>
            )}
            {currentStep === 3 && (
              <>
                <li>• Outline major plot points to maintain story structure</li>
                <li>• Plan your chapters to keep readers engaged</li>
                <li>• Include conflict and resolution in your plot points</li>
              </>
            )}
            {currentStep === 4 && (
              <>
                <li>• Describe your cover vision clearly for better AI generation</li>
                <li>• Choose visibility based on your publishing goals</li>
                <li>• Enable AI assistance to speed up your writing process</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookCreation;