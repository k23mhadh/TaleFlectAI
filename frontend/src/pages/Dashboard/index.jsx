import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    wordsGenerated: 0,
  });

  useEffect(() => {
    // Fetch user's recent projects and stats
    // This would connect to your backend API
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Mock data - replace with actual API call
    setRecentProjects([
      { id: 1, title: 'Fantasy Novel', progress: 70, lastEdited: '2025-02-20' },
      { id: 2, title: 'Sci-Fi Short Story', progress: 30, lastEdited: '2025-02-18' },
      { id: 3, title: 'Business Guide', progress: 90, lastEdited: '2025-02-15' },
    ]);

    setStats({
      totalBooks: 5,
      completedBooks: 2,
      wordsGenerated: 45000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Your Dashboard</h1>
          <Link 
            to="/new-project" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Book
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-300">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalBooks}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-300">Completed Books</h3>
            <p className="text-3xl font-bold text-green-400">{stats.completedBooks}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-300">Words Generated</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.wordsGenerated.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Projects</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left text-gray-300">Title</th>
                  <th className="px-4 py-2 text-left text-gray-300">Progress</th>
                  <th className="px-4 py-2 text-left text-gray-300">Last Edited</th>
                  <th className="px-4 py-2 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(project => (
                  <tr key={project.id} className="border-b border-gray-700">
                    <td className="px-4 py-3 text-gray-300">{project.title}</td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{project.progress}%</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{project.lastEdited}</td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/editor/${project.id}`} 
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/preview/${project.id}`} 
                        className="text-green-400 hover:text-green-300"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/projects" className="block text-blue-400 mt-4 text-right">
            View all projects →
          </Link>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-2">Tips for Better AI Generation</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            <li>Be specific about your genre and target audience</li>
            <li>Provide detailed character descriptions for more consistent storytelling</li>
            <li>Use the chapter planner to outline your book structure</li>
            <li>Review and edit AI-generated content for better quality</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;