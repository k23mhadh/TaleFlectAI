import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BookPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [previewMode, setPreviewMode] = useState('reader'); // reader, export, publish
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeTableOfContents: true,
    includeCover: true,
    includeChapterBreaks: true,
    fontStyle: 'serif',
    fontSize: 'medium',
  });
  
  useEffect(() => {
    fetchBookData();
  }, [id]);
  
  const fetchBookData = async () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockBook = {
        id: id,
        title: 'The Quantum Paradox',
        author: 'AI Author & You',
        description: 'A sci-fi novel about time travel and quantum mechanics',
        genre: 'Science Fiction',
        coverImage: '/api/placeholder/400/600',
        chapters: [
          { 
            id: 'ch1', 
            title: 'The Discovery', 
            content: `Dr. Sarah Chen had always known this day would come. The quantum equations had predicted it years ago, but seeing it manifested in the lab was another thing entirely. The particles weren't just entangled - they were bridging across time itself.

"Marcus, you need to see this," she called to her research partner. The readings were unmistakable. They had created a quantum bridge through time.

Dr. Marcus Wells approached the monitoring station cautiously, his experienced eyes widening as he scanned the data. "Is that what I think it is?"

"Yes," Sarah nodded, her heart racing. "Time coherence. The particles are communicating with versions of themselves from different temporal positions. We've done it, Marcus. We've found the doorway."`,
            wordCount: 2450 
          },
          { 
            id: 'ch2', 
            title: 'The First Jump', 
            content: `The laboratory hummed with an eerie vibration as the machine powered up. Sarah checked the calibrations one final time, her hands steady despite the magnitude of what they were about to attempt.

"All systems nominal," she announced, glancing at Marcus who was monitoring the quantum field stabilizers. "Particle acceleration at 97% and climbing."

"Sarah, if this works..." Marcus began, his voice trailing off.

"I know." She didn't need him to finish the thought. If they succeeded, human history would forever be divided into before and after this moment.`,
            wordCount: 1890 
          },
          { 
            id: 'ch3', 
            title: 'Temporal Consequences', 
            content: '', 
            wordCount: 0 
          },
        ],
        wordCount: 4340,
        dateCreated: '2025-02-20',
        lastUpdated: '2025-02-23',
      };
      
      setBook(mockBook);
      setLoading(false);
    }, 1000);
  };
  
  const nextChapter = () => {
    if (currentChapter < book.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleExportOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportOptions({
      ...exportOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleExport = () => {
    // Mock export function - would connect to backend
    alert(`Exporting book in ${exportFormat} format with selected options`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-gray-300">
          <p>Loading preview...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mode Selection */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('reader')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                previewMode === 'reader' ? 'bg-gray-700 shadow text-gray-100' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Reader Preview
            </button>
            <button
              onClick={() => setPreviewMode('export')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                previewMode === 'export' ? 'bg-gray-700 shadow text-gray-100' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setPreviewMode('publish')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                previewMode === 'publish' ? 'bg-gray-700 shadow text-gray-100' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Publish
            </button>
          </div>
        </div>
        
        {/* Reader Mode */}
        {previewMode === 'reader' && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book Info Sidebar */}
            <div className="md:w-64">
              <div className="bg-gray-800 rounded-lg shadow overflow-hidden sticky top-8">
                {/* Cover Image */}
                <img 
                  src={book.coverImage} 
                  alt={`${book.title} cover`}
                  className="w-full h-auto"
                />
                
                {/* Book Info */}
                <div className="p-4">
                  <h1 className="text-xl font-bold mb-1 text-gray-100">{book.title}</h1>
                  <p className="text-gray-400 text-sm mb-3">By {book.author}</p>
                  <p className="text-sm text-gray-300 mb-4">{book.description}</p>
                  
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{book.wordCount.toLocaleString()} words</p>
                    <p>Genre: {book.genre}</p>
                    <p>Last updated: {book.lastUpdated}</p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/editor/${id}`)}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Continue Editing
                  </button>
                </div>
                
                {/* Table of Contents */}
                <div className="border-t border-gray-700 p-4">
                  <h2 className="font-semibold mb-2 text-gray-100">Table of Contents</h2>
                  <nav>
                    <ul className="space-y-1">
                      {book.chapters.map((chapter, index) => (
                        <li key={chapter.id}>
                          <button
                            onClick={() => setCurrentChapter(index)}
                            className={`w-full text-left py-1 px-2 rounded text-sm ${
                              currentChapter === index ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {chapter.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Reading Pane */}
            <div className="flex-1">
              <div className="bg-gray-800 rounded-lg shadow p-8">
                {book.chapters[currentChapter].content ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6 text-gray-100">{book.chapters[currentChapter].title}</h2>
                    
                    {book.chapters[currentChapter].content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 leading-relaxed text-gray-300">{paragraph}</p>
                    ))}
                    
                    {/* Chapter Navigation */}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-700">
                      <button
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className={`px-4 py-2 flex items-center rounded ${
                          currentChapter === 0 
                            ? 'text-gray-500 cursor-not-allowed' 
                            : 'text-blue-400 hover:bg-blue-900'
                        }`}
                      >
                        ← Previous Chapter
                      </button>
                      <span className="text-sm text-gray-400">
                        Chapter {currentChapter + 1} of {book.chapters.length}
                      </span>
                      <button
                        onClick={nextChapter}
                        disabled={currentChapter === book.chapters.length - 1}
                        className={`px-4 py-2 flex items-center rounded ${
                          currentChapter === book.chapters.length - 1 
                            ? 'text-gray-500 cursor-not-allowed' 
                            : 'text-blue-400 hover:bg-blue-900'
                        }`}
                      >
                        Next Chapter →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">This chapter has no content yet.</p>
                    <button
                      onClick={() => navigate(`/editor/${id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Write This Chapter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Export Mode */}
        {previewMode === 'export' && (
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">Export Your Book</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-100">Export Options</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-300 font-medium mb-2">Format</label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`px-4 py-2 border rounded ${
                        exportFormat === 'pdf' 
                          ? 'border-blue-600 bg-blue-900 text-blue-200' 
                          : 'border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => setExportFormat('epub')}
                      className={`px-4 py-2 border rounded ${
                        exportFormat === 'epub' 
                          ? 'border-blue-600 bg-blue-900 text-blue-200' 
                          : 'border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      EPUB
                    </button>
                    <button
                      onClick={() => setExportFormat('docx')}
                      className={`px-4 py-2 border rounded ${
                        exportFormat === 'docx' 
                          ? 'border-blue-600 bg-blue-900 text-blue-200' 
                          : 'border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      DOCX
                    </button>
                    <button
                      onClick={() => setExportFormat('txt')}
                      className={`px-4 py-2 border rounded ${
                        exportFormat === 'txt' 
                          ? 'border-blue-600 bg-blue-900 text-blue-200' 
                          : 'border-gray-700 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Plain Text
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="includeTableOfContents"
                        checked={exportOptions.includeTableOfContents}
                        onChange={handleExportOptionChange}
                        className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2 text-gray-300">Include table of contents</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="includeCover"
                        checked={exportOptions.includeCover}
                        onChange={handleExportOptionChange}
                        className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2 text-gray-300">Include cover image</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="includeChapterBreaks"
                        checked={exportOptions.includeChapterBreaks}
                        onChange={handleExportOptionChange}
                        className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2 text-gray-300">Include chapter breaks</span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-gray-300 font-medium mb-2">Font Style</label>
                  <select
                    name="fontStyle"
                    value={exportOptions.fontStyle}
                    onChange={handleExportOptionChange}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  >
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans-serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-300 font-medium mb-2">Font Size</label>
                  <select
                    name="fontSize"
                    value={exportOptions.fontSize}
                    onChange={handleExportOptionChange}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-100">Preview</h3>
                
                <div className={`border border-gray-700 rounded p-6 preview-container ${
                  exportOptions.fontStyle === 'serif' ? 'font-serif' : 
                  exportOptions.fontStyle === 'sans-serif' ? 'font-sans' : 
                  'font-mono'
                } ${
                  exportOptions.fontSize === 'small' ? 'text-sm' : 
                  exportOptions.fontSize === 'large' ? 'text-lg' : 
                  'text-base'
                } bg-gray-700 text-gray-100`}>
                  {exportOptions.includeCover && (
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={book.coverImage} 
                        alt={`${book.title} cover`}
                        className="w-1/2 h-auto" 
                      />
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-bold mb-2 text-center">{book.title}</h1>
                  <p className="text-center mb-6 text-gray-300">By {book.author}</p>
                  
                  {exportOptions.includeTableOfContents && (
                    <>
                      <h2 className="text-xl font-semibold mb-3 mt-8">Table of Contents</h2>
                      <ul className="list-inside mb-8 text-gray-300">
                        {book.chapters.map((chapter, index) => (
                          <li key={chapter.id} className="mb-1">
                            {chapter.title} <span className="text-gray-500">{chapter.wordCount > 0 ? `(${chapter.wordCount} words)` : '(Empty)'}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {/* Sample chapter preview */}
                  {book.chapters[0].content && (
                    <>
                      {exportOptions.includeChapterBreaks && (
                        <div className="border-t border-gray-600 my-8"></div>
                      )}
                      <h2 className="text-xl font-semibold mb-4">{book.chapters[0].title}</h2>
                      <p className="mb-4 text-gray-300">{book.chapters[0].content.split('\n\n')[0]}...</p>
                    </>
                  )}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleExport}
                    className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    Export as {exportFormat.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Publish Mode */}
        {previewMode === 'publish' && (
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">Publish Your Book</h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-200">
                      Before publishing, make sure your book is complete and has been thoroughly edited. You can always update it later, but first impressions matter!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Publication Title</label>
                  <input
                    type="text"
                    defaultValue={book.title}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Author Name</label>
                  <input
                    type="text"
                    defaultValue={book.author}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Description/Blurb</label>
                  <textarea
                    defaultValue={book.description}
                    rows={4}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  />
                  <p className="mt-1 text-sm text-gray-400">150-300 character description that will appear in listings.</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Genre</label>
                  <select
                    defaultValue={book.genre}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  >
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Horror">Horror</option>
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Non-fiction">Non-fiction</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Keywords (comma separated)</label>
                  <input
                    type="text"
                    defaultValue="time travel, quantum physics, sci-fi"
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Price</label>
                  <div className="flex items-center">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">$</span>
                      </div>
                      <input
                        type="text"
                        defaultValue="9.99"
                        className="pl-7 p-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
                      />
                    </div>
                    <span className="ml-4 text-gray-400">USD</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <button
                      className="px-6 py-3 bg-gray-700 border border-gray-600 rounded font-medium text-gray-100 hover:bg-gray-600"
                    >
                      Save as Draft
                    </button>
                    <button
                      className="px-6 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700"
                    >
                      Publish Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BookPreview;