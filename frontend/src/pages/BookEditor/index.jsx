import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bold, Italic, Underline, Save, Download, Wand2, Lightbulb, 
  Eye, Settings, Sun, Moon, Maximize, Minimize, RotateCcw,
  Plus, Trash2, Move, Copy, Users, Share2, BookOpen
} from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatNumber, calculateReadingTime, debounce } from '../../utils';
import toast from 'react-hot-toast';

const BookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeChapter, setActiveChapter] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // UI State
  const [theme, setTheme] = useState('dark');
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chapters');
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCreativity, setAiCreativity] = useState(0.7);
  
  // Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeTableOfContents: true,
    includeCover: true,
    includeChapterBreaks: true
  });

  // Refs
  const editorRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Load book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBook(id);
        
        if (response.success) {
          setBook(response.data);
          
          if (response.data.chapters && response.data.chapters.length > 0) {
            const firstChapter = response.data.chapters[0];
            setActiveChapter(firstChapter._id);
            setContent(firstChapter.content || '');
            setTitle(firstChapter.title || '');
          }
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Failed to load book');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, navigate]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce(async (chapterId, chapterTitle, chapterContent) => {
      if (!chapterId) return;
      
      try {
        setSaving(true);
        await apiService.updateChapter(id, chapterId, {
          title: chapterTitle,
          content: chapterContent
        });
        
        // Update local state
        setBook(prev => ({
          ...prev,
          chapters: prev.chapters.map(ch => 
            ch._id === chapterId 
              ? { ...ch, title: chapterTitle, content: chapterContent, wordCount: chapterContent.split(/\s+/).filter(Boolean).length }
              : ch
          )
        }));
        
        toast.success('Saved', { duration: 1000 });
      } catch (error) {
        console.error('Auto-save error:', error);
        toast.error('Failed to save');
      } finally {
        setSaving(false);
      }
    }, 2000),
    [id]
  );

  // Handle content changes
  useEffect(() => {
    if (activeChapter && (content !== '' || title !== '')) {
      debouncedSave(activeChapter, title, content);
    }
  }, [content, title, activeChapter, debouncedSave]);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [content]);

  // Handle chapter selection
  const handleChapterSelect = useCallback(async (chapterId) => {
    // Save current chapter before switching
    if (activeChapter && activeChapter !== chapterId) {
      try {
        await apiService.updateChapter(id, activeChapter, {
          title,
          content
        });
      } catch (error) {
        console.error('Error saving current chapter:', error);
      }
    }

    const chapter = book.chapters.find(ch => ch._id === chapterId);
    if (chapter) {
      setActiveChapter(chapterId);
      setContent(chapter.content || '');
      setTitle(chapter.title || '');
    }
  }, [activeChapter, book?.chapters, content, title, id]);

  // Add new chapter
  const handleAddChapter = async () => {
    try {
      const newChapterTitle = `Chapter ${book.chapters.length + 1}`;
      const response = await apiService.addChapter(id, {
        title: newChapterTitle,
        content: ''
      });

      if (response.success) {
        setBook(prev => ({
          ...prev,
          chapters: [...prev.chapters, response.data]
        }));
        
        setActiveChapter(response.data._id);
        setContent('');
        setTitle(newChapterTitle);
        
        toast.success('Chapter added');
      }
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error('Failed to add chapter');
    }
  };

  // Delete chapter
  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    try {
      await apiService.deleteChapter(id, chapterId);
      
      const updatedChapters = book.chapters.filter(ch => ch._id !== chapterId);
      setBook(prev => ({ ...prev, chapters: updatedChapters }));
      
      if (activeChapter === chapterId) {
        if (updatedChapters.length > 0) {
          handleChapterSelect(updatedChapters[0]._id);
        } else {
          setActiveChapter(null);
          setContent('');
          setTitle('');
        }
      }
      
      toast.success('Chapter deleted');
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Failed to delete chapter');
    }
  };

  // AI Content Generation
  const handleAIGenerate = async () => {
    if (!activeChapter) {
      toast.error('Please select a chapter first');
      return;
    }

    try {
      setAiLoading(true);
      const response = await apiService.generateChapter(
        id, 
        activeChapter, 
        aiPrompt,
        aiCreativity
      );

      if (response.success) {
        setContent(response.data.content);
        setShowAIPanel(false);
        setAiPrompt('');
        toast.success('Content generated successfully!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setAiLoading(false);
    }
  };

  // Export functionality
  const handleExport = async () => {
    try {
      setLoading(true);
      const result = await apiService.exportBook(id, exportFormat, exportOptions);
      
      // Download the file
      apiService.downloadFile(result.blob, result.filename);
      
      setShowExportModal(false);
      toast.success(`Book exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export book');
    } finally {
      setLoading(false);
    }
  };

  // Manual save
  const handleManualSave = async () => {
    if (!activeChapter) return;

    try {
      setSaving(true);
      await apiService.updateChapter(id, activeChapter, {
        title,
        content
      });
      toast.success('Changes saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" color="yellow" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Book not found</h1>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Sidebar */}
      {!focusMode && (
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
          {/* Sidebar Header */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            {sidebarOpen && (
              <div>
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                  {book.title}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatNumber(book.wordCount)} words
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {sidebarOpen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Tabs */}
              <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeTab === 'chapters'
                      ? `border-b-2 border-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`
                      : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => setActiveTab('outline')}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeTab === 'outline'
                      ? `border-b-2 border-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`
                      : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  Outline
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'chapters' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        Chapters
                      </h3>
                      <button
                        onClick={handleAddChapter}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Add Chapter"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {book.chapters.map((chapter) => (
                        <div
                          key={chapter._id}
                          className={`p-3 rounded cursor-pointer border ${
                            activeChapter === chapter._id
                              ? `${theme === 'dark' ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`
                              : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`
                          }`}
                          onClick={() => handleChapterSelect(chapter._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {chapter.title}
                              </h4>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatNumber(chapter.wordCount || 0)} words
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChapter(chapter._id);
                              }}
                              className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-red-800 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                              title="Delete Chapter"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'outline' && (
                  <div>
                    <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Book Outline
                    </h3>
                    <div className={`p-4 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {book.outline || 'No outline available. Use AI to generate one!'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Chapter Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter Title"
                className={`text-xl font-bold bg-transparent border-none outline-none ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
              />
            </div>

            <div className="flex items-center space-x-2">
              {/* Word Count */}
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatNumber(wordCount)} words • {readingTime} min read
              </div>

              {/* AI Button */}
              <button
                onClick={() => setShowAIPanel(true)}
                disabled={aiLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                <Wand2 size={16} />
                <span>AI</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={saving}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download size={16} />
                <span>Export</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Focus Mode */}
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {focusMode ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your chapter here..."
            className={`w-full h-full resize-none p-8 text-lg leading-relaxed outline-none ${
              theme === 'dark' 
                ? 'bg-gray-900 text-gray-100 placeholder-gray-500' 
                : 'bg-white text-gray-900 placeholder-gray-400'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        {/* Status Bar */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'} border-t px-4 py-2 flex items-center justify-between text-sm`}>
          <div>
            {saving ? 'Saving...' : 'All changes saved'}
          </div>
          <div>
            Chapter {book.chapters.findIndex(ch => ch._id === activeChapter) + 1} of {book.chapters.length}
          </div>
        </div>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI Content Generator
              </h3>
              <button
                onClick={() => setShowAIPanel(false)}
                className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  What would you like me to write?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want to generate (e.g., 'Continue the story with a plot twist', 'Add dialogue between characters', etc.)"
                  className={`w-full h-24 p-3 border rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Creativity Level: {Math.round(aiCreativity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiCreativity}
                  onChange={(e) => setAiCreativity(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAIPanel(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {aiLoading ? <LoadingSpinner size="small" color="white" /> : <Wand2 size={16} />}
                  <span>{aiLoading ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Export Book
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['pdf', 'docx', 'epub', 'txt'].map(format => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-3 text-center rounded border ${
                        exportFormat === format
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : `${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTableOfContents}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeTableOfContents: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include table of contents</span>
                </label>
                
                <label className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCover}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeCover: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include cover page</span>
                </label>
                
                <label className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeChapterBreaks}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeChapterBreaks: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include chapter breaks</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? <LoadingSpinner size="small" color="white" /> : <Download size={16} />}
                  <span>{loading ? 'Exporting...' : 'Export'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookEditor;