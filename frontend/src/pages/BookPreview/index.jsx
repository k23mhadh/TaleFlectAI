import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Eye, 
  Clock, 
  BookOpen, 
  User,
  Calendar,
  Tag,
  Star,
  Edit,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatNumber, formatDate, calculateReadingTime, getProgressColor } from '../../utils';

const BookPreview = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readingMode, setReadingMode] = useState('read'); // 'read' or 'listen'
  const [isPlaying, setIsPlaying] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBook(id);
      
      if (response.success) {
        setBook(response.data);
        
        // Only show published chapters for preview
        const publishedChapters = response.data.chapters?.filter(
          ch => ch.status === 'published' || ch.content?.trim()
        ) || [];
        
        setBook({
          ...response.data,
          chapters: publishedChapters
        });
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterChange = (index) => {
    setCurrentChapter(index);
    setReadingProgress(0);
  };

  const nextChapter = () => {
    if (currentChapter < book.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setReadingProgress(0);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setReadingProgress(0);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      case 'xlarge': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900';
      case 'sepia':
        return 'bg-yellow-50 text-yellow-900';
      default:
        return 'bg-gray-900 text-gray-100';
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
          <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white mb-4">Book not found</h1>
          <Link
            to="/projects"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentChapterData = book.chapters[currentChapter];
  const isOwner = user?._id === book.author?._id || user?._id === book.author;

  return (
    <div className={`min-h-screen transition-colors ${getThemeClasses()}`}>
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={isOwner ? "/projects" : "/"}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div>
              <h1 className="text-xl font-bold">{book.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{book.author?.name || 'Unknown Author'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{calculateReadingTime(book.wordCount || 0)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen size={14} />
                  <span>{book.chapters?.length || 0} chapters</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Reading Mode Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setReadingMode('read')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  readingMode === 'read' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setReadingMode('listen')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  readingMode === 'listen' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Listen
              </button>
            </div>

            {/* Actions */}
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Share2 size={18} />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Download size={18} />
            </button>

            {isOwner && (
              <Link
                to={`/editor/${book._id}`}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-700 flex flex-col">
          {/* Book Info */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4 mb-4">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
              )}
              
              <div>
                <h2 className="font-bold text-lg">{book.title}</h2>
                <p className="text-gray-400 text-sm">{book.genre}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="text-yellow-400" size={14} />
                  <span className="text-sm">{book.analytics?.rating || 0}/5</span>
                  <span className="text-gray-400 text-sm">
                    ({book.analytics?.ratingCount || 0})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm line-clamp-3">
              {book.description}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <div className="flex items-center justify-between">
                <span>Progress</span>
                <span>{Math.round((currentChapter / Math.max(book.chapters.length - 1, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(Math.round((currentChapter / Math.max(book.chapters.length - 1, 1)) * 100))}`}
                  style={{ width: `${Math.round((currentChapter / Math.max(book.chapters.length - 1, 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Chapters</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, index) => (
                  <button
                    key={chapter._id || index}
                    onClick={() => handleChapterChange(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentChapter === index
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-sm opacity-75 mt-1">
                      {formatNumber(chapter.wordCount || 0)} words
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reading Controls */}
          <div className="p-4 border-t border-gray-700">
            {readingMode === 'listen' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapter === 0}
                    className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack size={20} />
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <button
                    onClick={nextChapter}
                    disabled={currentChapter === book.chapters.length - 1}
                    className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward size={20} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="50"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Display Settings */}
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="sepia">Sepia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {currentChapterData ? (
              <div className={`prose prose-lg max-w-none ${getFontSizeClass()}`}>
                <h1 className="text-3xl font-bold mb-8">{currentChapterData.title}</h1>
                
                <div 
                  className="leading-relaxed"
                  style={{ fontFamily: 'Georgia, serif' }}
                  dangerouslySetInnerHTML={{ 
                    __html: currentChapterData.content?.replace(/\n/g, '<br />') || 'No content available.' 
                  }}
                />

                {/* Chapter Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-700">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapter === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <span className="text-gray-400">
                    Chapter {currentChapter + 1} of {book.chapters.length}
                  </span>

                  <button
                    onClick={nextChapter}
                    disabled={currentChapter === book.chapters.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">No Content Available</h2>
                <p className="text-gray-400">This book doesn't have any published chapters yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;