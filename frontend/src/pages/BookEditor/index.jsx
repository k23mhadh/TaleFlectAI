import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Image as ImageIcon, Type, Heading1, Heading2, 
  Highlighter, PaintBucket, Crop, RotateCw, Trash2, ZoomIn, ZoomOut,
  MaximizeIcon, MinimizeIcon, ChevronDown, Save, Code, Sun,Moon ,X ,RotateCcw
} from 'lucide-react';

const BookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState('outline');
  const [activeChapter, setActiveChapter] = useState(null);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showGeneratePanel, setShowGeneratePanel] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [focusMode, setFocusMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showReferences, setShowReferences] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageZoom, setImageZoom] = useState(100);
  const [imageCrop, setImageCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [richTextMode, setRichTextMode] = useState(true);
  const [paragraphStyle, setParagraphStyle] = useState('normal'); // normal, h1, h2, etc.
  const [alignment, setAlignment] = useState('left'); // left, center, right
  
  const editorRef = useRef(null);
  const autoSaveTimeout = useRef(null);
  const colorPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  useEffect(() => {
    fetchBookData();
  }, [id]);

  useEffect(() => {
    if (content) {
      // Calculate word count and reading time
      const words = content.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // 200 words per minute
    }
  }, [content]);

  useEffect(() => {
    // Auto-save after 5 seconds of inactivity
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(() => {
      saveContent();
    }, 5000);

    return () => clearTimeout(autoSaveTimeout.current);
  }, [content]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchBookData = async () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockBook = {
        id: id,
        title: 'The Quantum Paradox',
        description: 'A sci-fi novel about time travel and quantum mechanics',
        genre: 'Science Fiction',
        chapters: [
          { id: 'ch1', title: 'The Discovery', content: 'Dr. Sarah Chen had always known this day would come...', wordCount: 2450 },
          { id: 'ch2', title: 'The First Jump', content: 'The laboratory hummed with an eerie vibration as the machine powered up...', wordCount: 1890 },
          { id: 'ch3', title: 'Temporal Consequences', content: '', wordCount: 0 },
          { id: 'ch4', title: 'Paradox Rising', content: '', wordCount: 0 },
        ],
        characters: [
          { name: 'Dr. Sarah Chen', role: 'Protagonist', description: 'Brilliant physicist specializing in quantum mechanics' },
          { name: 'Dr. Marcus Wells', role: 'Mentor', description: 'Sarah\'s former professor and research partner' },
        ],
        settings: [
          { name: 'Quantum Research Facility', description: 'A cutting-edge laboratory hidden in the mountains' },
          { name: '2042 Timeline', description: 'A future version of Earth facing climate disaster' },
        ],
        plotPoints: [
          'Discovery of quantum tunneling through time',
          'First successful time jump',
          'Meeting future self and creating paradox',
          'Resolution through quantum entanglement',
        ],
        images: [
          { id: 'img1', name: 'Research Facility Exterior', src: '/api/placeholder/400/300', caption: 'The Quantum Research Facility' },
          { id: 'img2', name: 'Time Machine Prototype', src: '/api/placeholder/400/300', caption: 'The experimental time device' },
        ]
      };
      
      setBook(mockBook);
      
      if (mockBook.chapters.length > 0) {
        setActiveChapter(mockBook.chapters[0].id);
        setContent(mockBook.chapters[0].content);
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleChapterChange = (chapterId) => {
    saveContent();
    const chapter = book.chapters.find(ch => ch.id === chapterId);
    setActiveChapter(chapterId);
    setContent(chapter.content);
  };

  const saveContent = async () => {
    if (!activeChapter) return;
    
    setSaving(true);
    
    // Mock save - replace with actual API call
    setTimeout(() => {
      const updatedChapters = book.chapters.map(ch => 
        ch.id === activeChapter 
          ? {...ch, content: content, wordCount: content.split(/\s+/).filter(Boolean).length}
          : ch
      );
      
      setBook({...book, chapters: updatedChapters});
      setSaving(false);
    }, 500);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTextSelection = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          const text = selection.toString();
          if (text) {
            setSelectedText(text);
            setSelectionRange(range);
          } else {
            setSelectedText('');
            setSelectionRange(null);
          }
        }
      }
    }
  };

  const applyTextStyle = (style) => {
    if (!selectionRange || !selectedText) return;
    
    // This is a simplified implementation - in a real app, you would use
    // a rich text editor library (like Draft.js, Slate, or QuillJS) for proper formatting
    
    const selectedContent = selectionRange.toString();
    const startPos = content.indexOf(selectedContent);
    if (startPos === -1) return;
    
    let formattedText = '';
    
    switch(style) {
      case 'bold':
        formattedText = `<strong>${selectedContent}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedContent}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedContent}</u>`;
        break;
      case 'highlight':
        formattedText = `<mark>${selectedContent}</mark>`;
        break;
      case 'color':
        formattedText = `<span style="color:${textColor}">${selectedContent}</span>`;
        break;
      case 'background':
        formattedText = `<span style="background-color:${backgroundColor}">${selectedContent}</span>`;
        break;
      case 'h1':
        formattedText = `<h1>${selectedContent}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2>${selectedContent}</h2>`;
        break;
      default:
        return;
    }
    
    const newContent = 
      content.substring(0, startPos) + 
      formattedText + 
      content.substring(startPos + selectedContent.length);
    
    setContent(newContent);
    setSelectedText('');
    setSelectionRange(null);
  };

  const addNewChapter = () => {
    saveContent();
    const newChapterId = `ch${book.chapters.length + 1}`;
    const newChapter = {
      id: newChapterId,
      title: `Chapter ${book.chapters.length + 1}`,
      content: '',
      wordCount: 0
    };
    
    const updatedChapters = [...book.chapters, newChapter];
    setBook({...book, chapters: updatedChapters});
    setActiveChapter(newChapterId);
    setContent('');
  };

  const generateContent = async () => {
    const currentChapter = book.chapters.find(ch => ch.id === activeChapter);
    
    setSaving(true);
    
    // Mock AI generation - replace with actual API call
    setTimeout(() => {
      const generatedText = `${content ? content + '\n\n' : ''}${
        currentChapter.title === 'The Discovery' 
          ? "Dr. Sarah Chen had always known this day would come. The quantum equations had predicted it years ago, but seeing it manifested in the lab was another thing entirely. The particles weren't just entangled - they were bridging across time itself.\n\n\"Marcus, you need to see this,\" she called to her research partner. The readings were unmistakable. They had created a quantum bridge through time.\n\nDr. Marcus Wells approached the monitoring station cautiously, his experienced eyes widening as he scanned the data. \"Is that what I think it is?\"\n\n\"Yes,\" Sarah nodded, her heart racing. \"Time coherence. The particles are communicating with versions of themselves from different temporal positions. We've done it, Marcus. We've found the doorway.\""
          : "The breakthrough was unexpected but unmistakable. As Sarah reviewed the data for the third time, she felt a strange mixture of elation and dread. What they had discovered would change humanity forever, but she wasn't sure if the world was ready for it."
      }`;
      
      setContent(generatedText);
      
      const updatedChapters = book.chapters.map(ch => 
        ch.id === activeChapter 
          ? {...ch, content: generatedText, wordCount: generatedText.split(/\s+/).filter(Boolean).length}
          : ch
      );
      
      setBook({...book, chapters: updatedChapters});
      setSaving(false);
      setShowGeneratePanel(false);
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  const insertReference = (reference) => {
    setContent(content + ` [${reference}]`);
  };

  const exportBook = (format) => {
    // Mock export functionality
    alert(`Exporting book as ${format}`);
  };

  const loadVersionHistory = () => {
    // Mock version history
    setVersions([
      { id: 'v1', timestamp: '2025-02-20 10:30', content: 'Initial draft' },
      { id: 'v2', timestamp: '2025-02-20 11:45', content: 'Added character dialogue' },
    ]);
    setShowVersionHistory(true);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newImage = {
          id: `img${book.images.length + 1}`,
          name: file.name,
          src: event.target.result,
          caption: 'New image'
        };
        
        setBook({
          ...book,
          images: [...book.images, newImage]
        });
        
        insertImageIntoContent(newImage);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const insertImageIntoContent = (image) => {
    const imageTag = `<img src="${image.src}" alt="${image.caption}" class="book-image" data-image-id="${image.id}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    setContent(content + '\n\n' + imageTag);
    saveContent();
  };

  const openImageEditor = (imageId) => {
    const image = book.images.find(img => img.id === imageId);
    if (image) {
      setCurrentImage(image);
      setShowImageEditor(true);
      setImageRotation(0);
      setImageZoom(100);
      setImageCrop({ x: 0, y: 0, width: 100, height: 100 });
    }
  };

  const saveImageEdits = () => {
    if (!currentImage) return;
    
    // In a real application, you would apply the transformations to the image
    // Here we'll just mock the behavior
    
    // Apply edits to the image in the book
    const updatedImages = book.images.map(img => 
      img.id === currentImage.id 
        ? {
            ...img,
            // In a real app, these would be applied to the actual image
            rotation: imageRotation,
            zoom: imageZoom,
            crop: imageCrop
          } 
        : img
    );
    
    setBook({...book, images: updatedImages});
    
    // Update the image in the content (this is simplified - in a real app you'd handle the DOM updates)
    const imgRegex = new RegExp(`<img[^>]*data-image-id="${currentImage.id}"[^>]*>`, 'g');
    const updatedImg = `<img src="${currentImage.src}" alt="${currentImage.caption}" class="book-image" data-image-id="${currentImage.id}" style="max-width: 100%; height: auto; margin: 10px 0; transform: rotate(${imageRotation}deg) scale(${imageZoom/100});" />`;
    
    setContent(content.replace(imgRegex, updatedImg));
    
    setShowImageEditor(false);
    setCurrentImage(null);
    saveContent();
  };

  const deleteImage = () => {
    if (!currentImage) return;
    
    // Remove the image from the book's image collection
    const updatedImages = book.images.filter(img => img.id !== currentImage.id);
    setBook({...book, images: updatedImages});
    
    // Remove the image from the content
    const imgRegex = new RegExp(`<img[^>]*data-image-id="${currentImage.id}"[^>]*>`, 'g');
    setContent(content.replace(imgRegex, ''));
    
    setShowImageEditor(false);
    setCurrentImage(null);
    saveContent();
  };

  const toggleRichTextMode = () => {
    setRichTextMode(!richTextMode);
  };

  const applyAlignment = (align) => {
    setAlignment(align);
    
    if (!selectionRange || !selectedText) return;
    
    const selectedContent = selectionRange.toString();
    const startPos = content.indexOf(selectedContent);
    if (startPos === -1) return;
    
    let formattedText = `<div style="text-align:${align}">${selectedContent}</div>`;
    
    const newContent = 
      content.substring(0, startPos) + 
      formattedText + 
      content.substring(startPos + selectedContent.length);
    
    setContent(newContent);
    setSelectedText('');
    setSelectionRange(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
          {/* Book Title */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`font-bold text-xl truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{book.title}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{book.genre}</p>
          </div>
          
          {/* Sidebar Tabs */}
          <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              className={`flex-1 py-3 text-sm font-medium ${
                activeSidebar === 'outline' 
                  ? `border-b-2 ${theme === 'dark' ? 'border-blue-600 text-blue-400' : 'border-blue-600 text-blue-600'}` 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveSidebar('outline')}
            >
              Outline
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium ${
                activeSidebar === 'settings' 
                  ? `border-b-2 ${theme === 'dark' ? 'border-blue-600 text-blue-400' : 'border-blue-600 text-blue-600'}` 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveSidebar('settings')}
            >
              Details
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium ${
                activeSidebar === 'generate' 
                  ? `border-b-2 ${theme === 'dark' ? 'border-blue-600 text-blue-400' : 'border-blue-600 text-blue-600'}` 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveSidebar('generate')}
            >
              Generate
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeSidebar === 'outline' && (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Chapters</h2>
                  <button 
                    onClick={addNewChapter}
                    className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    + Add Chapter
                  </button>
                </div>
                
                <ul className="space-y-1">
                  {book.chapters.map(chapter => (
                    <li key={chapter.id}>
                      <button
                        onClick={() => handleChapterChange(chapter.id)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          activeChapter === chapter.id 
                            ? `${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}` 
                            : `${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-800'}`
                        }`}
                      >
                        <div className="font-medium truncate">{chapter.title}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {chapter.wordCount > 0 ? `${chapter.wordCount} words` : 'Empty'}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Images</h2>
                  <button
                    onClick={() => imageInputRef.current.click()}
                    className={`text-sm mb-3 flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <ImageIcon size={16} className="mr-1" /> Upload Image
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <ul className="space-y-2">
                    {book.images.map(image => (
                      <li key={image.id} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                        <div className="flex items-center">
                          <img src={image.src} alt={image.name} className="w-10 h-10 object-cover rounded mr-2" />
                          <div className="flex-1">
                            <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{image.name}</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{image.caption}</div>
                          </div>
                          <button
                            onClick={() => openImageEditor(image.id)}
                            className={`px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} rounded`}
                          >
                            Edit
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeSidebar === 'settings' && (
              <div className="p-4">
                <div className="mb-4">
                  <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Characters</h2>
                  <ul className="space-y-2">
                    {book.characters.map((character, idx) => (
                      <li key={idx} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{character.name}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{character.role}</div>
                        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{character.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Settings</h2>
                  <ul className="space-y-2">
                    {book.settings.map((setting, idx) => (
                      <li key={idx} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{setting.name}</div>
                        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{setting.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Plot Points</h2>
                  <ul className={`space-y-1 list-disc pl-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {book.plotPoints.map((point, idx) => (
                      <li key={idx} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeSidebar === 'generate' && (
              <div className="p-4">
                <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-3`}>AI Generation</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setGeneratePrompt("Continue the chapter with the next scene");
                      setShowGeneratePanel(true);
                    }}
                    className={`w-full p-3 text-left ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 border-blue-800' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'} rounded border`}
                  >
                    <div className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>Continue Writing</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Generate the next part of your current chapter</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setGeneratePrompt("Create a compelling character dialogue");
                      setShowGeneratePanel(true);
                    }}
                    className={`w-full p-3 text-left ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 border-blue-800' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'} rounded border`}
                  >
                    <div className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>Add Dialogue</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Generate conversation between characters</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setGeneratePrompt("Create a detailed description of the scene setting");
                      setShowGeneratePanel(true);
                    }}
                    className={`w-full p-3 text-left ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 border-blue-800' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'} rounded border`}
                  >
                    <div className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>Describe Setting</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Generate vivid scene descriptions</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setGeneratePrompt("Create a plot twist or unexpected event");
                      setShowGeneratePanel(true);
                    }}
                    className={`w-full p-3 text-left ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 border-blue-800' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'} rounded border`}
                    >
                      <div className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>Add Plot Twist</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Generate an unexpected turn of events</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Toolbar */}
            <div className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-2`}>
              <div className="flex items-center flex-wrap">
                {/* Format Options */}
                <div className="mr-4 flex space-x-1">
                  <button 
                    onClick={() => applyTextStyle('bold')}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Bold"
                  >
                    <Bold size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => applyTextStyle('italic')}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Italic"
                  >
                    <Italic size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => applyTextStyle('underline')}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Underline"
                  >
                    <Underline size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => applyTextStyle('highlight')}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Highlight"
                  >
                    <Highlighter size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                </div>
                
                {/* Paragraph Styles */}
                <div className="mr-4 flex">
                  <div className={`relative inline-block text-left border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pr-3`}>
                    <button 
                      className={`flex items-center p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
                      onClick={() => setParagraphStyle('h1')}
                    >
                      <Type size={16} className="mr-1" />
                      <span className="text-sm">Paragraph</span>
                      <ChevronDown size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
                
                {/* Alignment */}
                <div className="mr-4 flex space-x-1">
                  <button 
                    onClick={() => applyAlignment('left')}
                    className={`p-1.5 rounded ${alignment === 'left' 
                      ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}` 
                      : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}
                    title="Align Left"
                  >
                    <AlignLeft size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => applyAlignment('center')}
                    className={`p-1.5 rounded ${alignment === 'center' 
                      ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}` 
                      : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}
                    title="Align Center"
                  >
                    <AlignCenter size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => applyAlignment('right')}
                    className={`p-1.5 rounded ${alignment === 'right' 
                      ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}` 
                      : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}
                    title="Align Right"
                  >
                    <AlignRight size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                </div>
                
                {/* Lists */}
                <div className="mr-4 flex space-x-1">
                  <button 
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Bullet List"
                  >
                    <List size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Numbered List"
                  >
                    <ListOrdered size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                </div>
                
                {/* Colors */}
                <div className="mr-4 flex space-x-1">
                  <button 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Text Color"
                  >
                    <PaintBucket size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  {showColorPicker && (
                    <div 
                      ref={colorPickerRef}
                      className={`absolute top-12 z-10 p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded shadow-lg`}
                    >
                      <div className="flex space-x-1 mb-1">
                        <button 
                          onClick={() => {setTextColor('#FF0000'); applyTextStyle('color');}}
                          className="w-6 h-6 bg-red-600 rounded"
                        ></button>
                        <button 
                          onClick={() => {setTextColor('#0000FF'); applyTextStyle('color');}}
                          className="w-6 h-6 bg-blue-600 rounded"
                        ></button>
                        <button 
                          onClick={() => {setTextColor('#008000'); applyTextStyle('color');}}
                          className="w-6 h-6 bg-green-600 rounded"
                        ></button>
                        <button 
                          onClick={() => {setTextColor('#FFA500'); applyTextStyle('color');}}
                          className="w-6 h-6 bg-yellow-500 rounded"
                        ></button>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => {setBackgroundColor('#FFFF00'); applyTextStyle('background');}}
                          className="w-6 h-6 bg-yellow-200 rounded"
                        ></button>
                        <button 
                          onClick={() => {setBackgroundColor('#00FFFF'); applyTextStyle('background');}}
                          className="w-6 h-6 bg-cyan-200 rounded"
                        ></button>
                        <button 
                          onClick={() => {setBackgroundColor('#FF00FF'); applyTextStyle('background');}}
                          className="w-6 h-6 bg-pink-200 rounded"
                        ></button>
                        <button 
                          onClick={() => {setBackgroundColor('#CCCCCC'); applyTextStyle('background');}}
                          className="w-6 h-6 bg-gray-300 rounded"
                        ></button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Image */}
                <div className="mr-4">
                  <button 
                    onClick={() => imageInputRef.current.click()}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title="Insert Image"
                  >
                    <ImageIcon size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                </div>
                
                {/* Rich Text Toggle */}
                <div className="mr-4">
                  <button 
                    onClick={toggleRichTextMode}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title={richTextMode ? "Switch to HTML Mode" : "Switch to Rich Text Mode"}
                  >
                    <Code size={16} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${richTextMode ? '' : 'text-blue-500'}`} />
                  </button>
                </div>
                
                <div className="flex-1"></div>
                
                {/* View Options */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleTheme}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {theme === 'dark' ? (
                      <Sun size={16} className="text-gray-200" />
                    ) : (
                      <Moon size={16} className="text-gray-700" />
                    )}
                  </button>
                  <button 
                    onClick={toggleFocusMode}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                  >
                    {focusMode ? (
                      <MinimizeIcon size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                    ) : (
                      <MaximizeIcon size={16} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                    )}
                  </button>
                  <button 
                    onClick={saveContent}
                    className={`flex items-center px-3 py-1.5 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    title="Save"
                  >
                    <Save size={16} className="mr-1" />
                    <span className="text-sm">Save</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Editor */}
            <div className="flex-1 overflow-auto">
              <div className={`h-full ${focusMode ? 'max-w-3xl mx-auto px-8' : 'px-4'}`}>
                {activeChapter && (
                  <div className="h-full">
                    <h2 className={`text-2xl font-bold py-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                      {book.chapters.find(ch => ch.id === activeChapter)?.title}
                    </h2>
                    
                    <div 
                      className={`w-full h-[calc(100%-5rem)] ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
                    >
                      <textarea
                        ref={editorRef}
                        value={content}
                        onChange={handleContentChange}
                        onMouseUp={handleTextSelection}
                        onKeyUp={handleTextSelection}
                        className={`w-full h-full resize-none p-4 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} focus:outline-none`}
                        style={{
                          fontFamily: fontFamily,
                          fontSize: fontSize,
                        }}
                        placeholder="Start writing your chapter here..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Bar */}
            <div className={`p-2 border-t flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
              <div className="text-xs">
                {saving ? 'Saving...' : 'Last saved: Just now'}
              </div>
              <div className="text-xs flex space-x-4">
                <span>{wordCount} words</span>
                <span>~{readingTime} min read</span>
                <button 
                  onClick={() => setShowReferences(!showReferences)}
                  className="hover:underline"
                >
                  References
                </button>
                <button 
                  onClick={loadVersionHistory}
                  className="hover:underline"
                >
                  Version History
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Generate Content Panel */}
        {showGeneratePanel && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
            <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Generate Content</h3>
              </div>
              <div className="p-4">
                <textarea
                  value={generatePrompt}
                  onChange={(e) => setGeneratePrompt(e.target.value)}
                  className={`w-full h-32 p-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                  placeholder="Describe what you'd like to generate..."
                />
                
                <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  AI will generate content based on your book's context and this prompt.
                </div>
              </div>
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                <button
                  onClick={() => setShowGeneratePanel(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={generateContent}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* References Panel */}
        {showReferences && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
            <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>References</h3>
                <button 
                  onClick={() => setShowReferences(false)}
                  className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                  <li className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                    <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Quantum Entanglement</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>A phenomenon where particles become correlated such that the quantum state of each particle cannot be described independently.</div>
                    <button 
                      onClick={() => insertReference('Einstein, A., Podolsky, B., & Rosen, N. (1935). Can quantum-mechanical description of physical reality be considered complete?')}
                      className={`mt-1 text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Insert Reference
                    </button>
                  </li>
                  <li className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                    <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Temporal Paradoxes</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Contradictions in the timeline that may occur due to time travel, including the grandfather paradox and bootstrap paradox.</div>
                    <button 
                      onClick={() => insertReference('Hawking, S. (1992). Chronology protection conjecture. Physical Review D, 46(2), 603.')}
                      className={`mt-1 text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Insert Reference
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Version History Panel */}
        {showVersionHistory && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
            <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Version History</h3>
                <button 
                  onClick={() => setShowVersionHistory(false)}
                  className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                  {versions.map(version => (
                    <li key={version.id} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                      <div className="flex justify-between">
                        <div className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{version.timestamp}</div>
                        <div className="flex space-x-2">
                          <button 
                            className={`text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            View
                          </button>
                          <button 
                            className={`text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                      <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{version.content}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Image Editor */}
        {showImageEditor && currentImage && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
            <div className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Edit Image: {currentImage.name}</h3>
                <button 
                  onClick={() => setShowImageEditor(false)}
                  className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4">
                {/* Image Preview */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={currentImage.src} 
                      alt={currentImage.caption} 
                      className="max-w-full max-h-64 object-contain"
                      style={{
                        transform: `rotate(${imageRotation}deg) scale(${imageZoom/100})`,
                      }}
                    />
                  </div>
                </div>
                
                {/* Image Tools */}
                <div className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded mb-4 flex justify-center space-x-4`}>
                  <button 
                    onClick={() => setImageRotation((prev) => prev - 90)}
                    className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Rotate Left"
                  >
                    <RotateCcw size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => setImageRotation((prev) => prev + 90)}
                    className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Rotate Right"
                  >
                    <RotateCw size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => setImageZoom((prev) => Math.min(prev + 10, 200))}
                    className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Zoom In"
                  >
                    <ZoomIn size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => setImageZoom((prev) => Math.max(prev - 10, 50))}
                    className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Zoom Out"
                  >
                    <ZoomOut size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={() => setShowImageToolbar(!showImageToolbar)}
                    className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    title="Crop"
                  >
                    <Crop size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  </button>
                  <button 
                    onClick={deleteImage}
                    className={`p-2 rounded ${theme === 'dark' ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'}`}
                    title="Delete Image"
                  >
                    <Trash2 size={20} className={theme === 'dark' ? 'text-red-200' : 'text-red-600'} />
                  </button>
                </div>
                
                {/* Caption */}
                <div className="mb-4">
                  <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Caption
                  </label>
                  <input
                    type="text"
                    value={currentImage.caption}
                    onChange={(e) => setCurrentImage({...currentImage, caption: e.target.value})}
                    className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                  />
                </div>
              </div>
              
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                <button
                  onClick={() => setShowImageEditor(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveImageEdits}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default BookEditor;