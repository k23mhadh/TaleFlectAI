import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Tag,
  Globe,
  FileText,
  Image,
  Video,
  Book,
  Lightbulb,
  Star,
  Clock,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatRelativeTime } from '../../utils';

const Bookmarks = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [categories] = useState([
    { id: 'all', name: 'All', icon: Bookmark },
    { id: 'research', name: 'Research', icon: Book },
    { id: 'inspiration', name: 'Inspiration', icon: Lightbulb },
    { id: 'reference', name: 'Reference', icon: FileText },
    { id: 'tools', name: 'Tools', icon: Globe },
    { id: 'media', name: 'Media', icon: Image }
  ]);

  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    category: 'research',
    tags: [],
    notes: ''
  });

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      // const response = await apiService.getBookmarks();
      
      // Mock data for now
      const mockBookmarks = [
        {
          id: 1,
          title: 'Character Development Guide',
          url: 'https://writersdigest.com/character-development',
          description: 'Comprehensive guide on creating compelling characters',
          category: 'reference',
          tags: ['characters', 'writing-tips', 'development'],
          notes: 'Great resource for developing backstories and character arcs',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          favorite: true
        },
        {
          id: 2,
          title: 'Fantasy World Building Resources',
          url: 'https://worldbuilding.com/fantasy-guide',
          description: 'Tools and techniques for creating fantasy worlds',
          category: 'inspiration',
          tags: ['worldbuilding', 'fantasy', 'creativity'],
          notes: 'Excellent for creating detailed fantasy settings',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          favorite: false
        },
        {
          id: 3,
          title: 'Grammarly Writing Assistant',
          url: 'https://grammarly.com',
          description: 'AI-powered writing assistant for grammar and style',
          category: 'tools',
          tags: ['grammar', 'editing', 'ai'],
          notes: 'Useful for proofreading and style suggestions',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          favorite: true
        },
        {
          id: 4,
          title: 'Medieval History Research',
          url: 'https://medievalhistory.net',
          description: 'Detailed historical information for period fiction',
          category: 'research',
          tags: ['history', 'medieval', 'research'],
          notes: 'Great for historical accuracy in medieval fantasy',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          favorite: false
        },
        {
          id: 5,
          title: 'Writing Prompts Collection',
          url: 'https://writingprompts.com',
          description: 'Daily writing prompts and creative exercises',
          category: 'inspiration',
          tags: ['prompts', 'creativity', 'exercises'],
          notes: 'Good for overcoming writers block',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          favorite: false
        }
      ];
      
      setBookmarks(mockBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    
    if (!newBookmark.title || !newBookmark.url) {
      return;
    }

    try {
      // Simulate API call
      // const response = await apiService.createBookmark(newBookmark);
      
      const bookmark = {
        id: Date.now(),
        ...newBookmark,
        createdAt: new Date(),
        favorite: false
      };

      setBookmarks([bookmark, ...bookmarks]);
      setNewBookmark({
        title: '',
        url: '',
        description: '',
        category: 'research',
        tags: [],
        notes: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setNewBookmark({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      category: bookmark.category,
      tags: bookmark.tags,
      notes: bookmark.notes || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateBookmark = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      // const response = await apiService.updateBookmark(editingBookmark.id, newBookmark);
      
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.id === editingBookmark.id 
          ? { ...bookmark, ...newBookmark }
          : bookmark
      ));
      
      setEditingBookmark(null);
      setNewBookmark({
        title: '',
        url: '',
        description: '',
        category: 'research',
        tags: [],
        notes: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    try {
      // Simulate API call
      // await apiService.deleteBookmark(id);
      
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      // Simulate API call
      // await apiService.toggleBookmarkFavorite(id);
      
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.id === id 
          ? { ...bookmark, favorite: !bookmark.favorite }
          : bookmark
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim().toLowerCase();
      if (!newBookmark.tags.includes(tag)) {
        setNewBookmark({
          ...newBookmark,
          tags: [...newBookmark.tags, tag]
        });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setNewBookmark({
      ...newBookmark,
      tags: newBookmark.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => bookmark.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const getTypeIcon = (url) => {
    if (url.includes('youtube.com') || url.includes('vimeo.com')) return Video;
    if (url.includes('docs.google.com') || url.includes('.pdf')) return FileText;
    if (url.includes('pinterest.com') || url.includes('unsplash.com')) return Image;
    return Globe;
  };

  const allTags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" color="yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center">
              <Bookmark className="mr-3 text-yellow-400" />
              Bookmarks
            </h1>
            <p className="text-gray-400 mt-1">Save and organize your writing resources</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Bookmark</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map(bookmark => {
            const TypeIcon = getTypeIcon(bookmark.url);
            const CategoryIcon = categories.find(c => c.id === bookmark.category)?.icon || Bookmark;
            
            return (
              <div key={bookmark.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TypeIcon size={16} className="text-gray-400" />
                      <CategoryIcon size={16} className="text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(bookmark.id)}
                        className={`transition-colors ${
                          bookmark.favorite 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star size={16} fill={bookmark.favorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleEditBookmark(bookmark)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2">
                    {bookmark.title}
                  </h3>

                  {/* Description */}
                  {bookmark.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {bookmark.description}
                    </p>
                  )}

                  {/* Tags */}
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {bookmark.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {bookmark.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{bookmark.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {bookmark.notes && (
                    <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {bookmark.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-1 text-gray-400 text-xs">
                      <Clock size={12} />
                      <span>{formatRelativeTime(bookmark.createdAt)}</span>
                    </div>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      <span>Visit</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {bookmarks.length === 0 
                ? 'Start saving useful resources for your writing projects'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {bookmarks.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Bookmark
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Bookmark Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-gray-100">
                  {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
                </h2>
              </div>
              
              <form onSubmit={editingBookmark ? handleUpdateBookmark : handleAddBookmark} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter bookmark title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBookmark.description}
                    onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Brief description of this resource"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={newBookmark.category}
                    onChange={(e) => setNewBookmark({...newBookmark, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Press Enter to add tags"
                  />
                  {newBookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newBookmark.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-sm rounded-full"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newBookmark.notes}
                    onChange={(e) => setNewBookmark({...newBookmark, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Personal notes about this resource"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingBookmark(null);
                      setNewBookmark({
                        title: '',
                        url: '',
                        description: '',
                        category: 'research',
                        tags: [],
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingBookmark ? 'Update' : 'Add'} Bookmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;