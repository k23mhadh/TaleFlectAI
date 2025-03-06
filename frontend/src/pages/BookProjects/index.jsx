import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

const BookProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastEdited');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all user projects
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Mock data - replace with actual API call
    const mockProjects = [
      { id: 1, title: 'Fantasy Novel', genre: 'Fantasy', progress: 70, lastEdited: '2025-02-20', status: 'in-progress' },
      { id: 2, title: 'Sci-Fi Short Story', genre: 'Science Fiction', progress: 30, lastEdited: '2025-02-18', status: 'in-progress' },
      { id: 3, title: 'Business Guide', genre: 'Non-Fiction', progress: 90, lastEdited: '2025-02-15', status: 'in-progress' },
      { id: 4, title: 'Poetry Collection', genre: 'Poetry', progress: 100, lastEdited: '2025-02-10', status: 'completed' },
      { id: 5, title: 'Travel Memoir', genre: 'Memoir', progress: 100, lastEdited: '2025-02-05', status: 'completed' },
      { id: 6, title: 'Mystery Novel Outline', genre: 'Mystery', progress: 10, lastEdited: '2025-02-22', status: 'draft' },
    ];
    
    setProjects(mockProjects);
  };

  // Filter projects based on status and search term
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.genre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'progress') {
      return b.progress - a.progress;
    } else if (sortBy === 'lastEdited') {
      return new Date(b.lastEdited) - new Date(a.lastEdited);
    }
    return 0;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">Draft</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded bg-blue-700 text-blue-200">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded bg-green-700 text-green-200">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Your Book Projects</h1>
          <Link 
            to="/new-project" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Book
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('draft')} 
                className={`px-3 py-1 rounded ${filter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Drafts
              </button>
              <button 
                onClick={() => setFilter('in-progress')} 
                className={`px-3 py-1 rounded ${filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                In Progress
              </button>
              <button 
                onClick={() => setFilter('completed')} 
                className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Completed
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="px-3 py-2 border border-gray-700 rounded w-full md:w-64 bg-gray-900 text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastEdited">Sort by Latest</option>
                <option value="title">Sort by Title</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <div key={project.id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-100 mb-1">{project.title}</h2>
                  {getStatusBadge(project.status)}
                </div>
                <p className="text-gray-300 mb-3">{project.genre}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">Last edited: {project.lastEdited}</p>
                <div className="flex space-x-2">
                  <Link 
                    to={`/editor/${project.id}`} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/preview/${project.id}`} 
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 text-center py-2 px-4 rounded"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects match your search criteria.</p>
            <Link 
              to="/new-project" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Create Your First Book
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BookProjects;