import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockUser = {
        id: 'user123',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        bio: 'Passionate sci-fi writer with a background in physics. I love exploring quantum concepts through narrative fiction.',
        avatar: '/api/placeholder/150/150',
        joinDate: '2023-11-15',
        location: 'San Francisco, CA',
        website: 'alexjohnsonwrites.com',
        social: {
          twitter: '@alexjwrites',
          instagram: 'alexjfiction',
          goodreads: 'alexjohnson'
        },
        readingPreferences: {
          favoriteGenres: ['Science Fiction', 'Mystery', 'Non-fiction'],
          readingGoal: 50,
          currentlyReading: 3
        },
        accountSettings: {
          emailNotifications: true,
          pushNotifications: false,
          newsletterSubscription: true,
          publicProfile: true,
          twoFactorAuth: false
        },
        statistics: {
          booksPublished: 5,
          booksInProgress: 2,
          totalReads: 3420,
          publishedWords: 325750,
          avgRating: 4.7
        },
        recentActivity: [
          { type: 'published', title: 'The Quantum Paradox', date: '2025-02-10' },
          { type: 'draft', title: 'Stellar Convergence', date: '2025-01-28' },
          { type: 'review', title: 'The Time Machine', author: 'H.G. Wells', rating: 5, date: '2025-01-15' }
        ]
      };
      
      setUserData(mockUser);
      setFormData({
        name: mockUser.name,
        email: mockUser.email,
        bio: mockUser.bio,
        location: mockUser.location,
        website: mockUser.website,
        twitter: mockUser.social.twitter,
        instagram: mockUser.social.instagram,
        goodreads: mockUser.social.goodreads
      });
      setNotificationSettings(mockUser.accountSettings);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Reset status messages
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    // Mock password update
    setTimeout(() => {
      setPasswordSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Mock profile update
    setTimeout(() => {
      setUserData({
        ...userData,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        social: {
          twitter: formData.twitter,
          instagram: formData.instagram,
          goodreads: formData.goodreads
        }
      });
      setIsEditing(false);
    }, 1000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with user info */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={avatarPreview || userData.avatar} 
                  alt={userData.name} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-600"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                  <p className="text-purple-400">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isEditing 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{userData.email}</span>
                  </div>
                  
                  {userData.location && (
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{userData.location}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  {userData.website && (
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <a href={`https://${userData.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        {userData.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    {userData.social.twitter && (
                      <a href={`https://twitter.com/${userData.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                    )}
                    
                    {userData.social.instagram && (
                      <a href={`https://instagram.com/${userData.social.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </a>
                    )}
                    
                    {userData.social.goodreads && (
                      <a href={`https://goodreads.com/${userData.social.goodreads}`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                          <path d="M13 7h-2v6h2v-6zm0 8h-2v2h2v-2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {userData.bio && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg text-gray-200">
                  <p>{userData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-700">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('reading')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'reading'
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Reading Preferences
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'statistics'
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Account Settings
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Profile Edit Form */}
            {activeTab === 'profile' && (
              <div>
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Website</label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-300 font-medium mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Twitter</label>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder="@username"
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Instagram</label>
                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="username"
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Goodreads</label>
                        <input
                          type="text"
                          name="goodreads"
                          value={formData.goodreads}
                          onChange={handleInputChange}
                          placeholder="username"
                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      Click "Edit Profile" above to update your profile information.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Reading Preferences */}
            {activeTab === 'reading' && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-white">Reading Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userData.readingPreferences.favoriteGenres.map(genre => (
                        <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">{genre}</span>
                      ))}
                      <button className="px-3 py-1 bg-gray-800 text-purple-400 rounded-full text-sm hover:bg-gray-600">+ Add</button>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 mt-6 text-purple-300">Currently Reading</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.readingPreferences.currentlyReading}</span>
                      <span className="ml-2 text-gray-400">books</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Reading Goal</h3>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <span className="text-3xl font-bold text-white">{userData.readingPreferences.readingGoal}</span>
                        <span className="ml-2 text-gray-400">books per year</span>
                      </div>
                      
                      <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                        <div className="bg-purple-600 h-4 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">60% of goal reached</span>
                      
                      <button className="mt-4 px-4 py-2 bg-gray-800 text-purple-400 rounded hover:bg-gray-600 self-start">
                        Update Reading Goal
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Reading History</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-400 font-medium">Title</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Author</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Date Read</th>
                            <th className="text-left py-2 text-gray-400 font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-600">
                            <td className="py-3 text-white">The Time Machine</td>
                            <td className="py-3 text-gray-300">H.G. Wells</td>
                            <td className="py-3 text-gray-400">Jan 15, 2025</td>
                            <td className="py-3">
                              <div className="flex text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            {activeTab === 'statistics' && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-white">Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Books Published</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.statistics.booksPublished}</span>
                      <span className="ml-2 text-gray-400">books</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Books in Progress</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.statistics.booksInProgress}</span>
                      <span className="ml-2 text-gray-400">books</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Total Reads</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.statistics.totalReads}</span>
                      <span className="ml-2 text-gray-400">reads</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Published Words</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.statistics.publishedWords.toLocaleString()}</span>
                      <span className="ml-2 text-gray-400">words</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-purple-300">Average Rating</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-white">{userData.statistics.avgRating}</span>
                      <span className="ml-2 text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-white">Recent Activity</h2>
                
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="bg-gray-700 p-5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-purple-300">{activity.title}</h3>
                          <p className="text-gray-400">
                            {activity.type === 'published' && `Published on ${activity.date}`}
                            {activity.type === 'draft' && `Draft created on ${activity.date}`}
                            {activity.type === 'review' && `Reviewed on ${activity.date}`}
                          </p>
                        </div>
                        {activity.type === 'review' && (
                          <div className="flex text-yellow-400">
                            {Array.from({ length: activity.rating }).map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-white">Account Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Email Notifications</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={notificationSettings.emailNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Push Notifications</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={notificationSettings.pushNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Newsletter Subscription</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="newsletterSubscription"
                            checked={notificationSettings.newsletterSubscription}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Public Profile</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="publicProfile"
                            checked={notificationSettings.publicProfile}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Two-Factor Authentication</span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="twoFactorAuth"
                            checked={notificationSettings.twoFactorAuth}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Change Password</h3>
                    
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 font-medium mb-2">Current Password</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 font-medium mb-2">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 font-medium mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        
                        {passwordError && (
                          <div className="text-red-400 text-sm">{passwordError}</div>
                        )}
                        
                        {passwordSuccess && (
                          <div className="text-green-400 text-sm">{passwordSuccess}</div>
                        )}
                        
                        <button
                          type="submit"
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;