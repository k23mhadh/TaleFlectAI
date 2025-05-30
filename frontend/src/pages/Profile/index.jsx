import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Globe, 
  MapPin, 
  Twitter, 
  Instagram, 
  BookOpen,
  Edit,
  Shield,
  Trash2,
  Settings,
  Award,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatNumber } from '../../utils';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    social: {
      twitter: '',
      instagram: '',
      goodreads: ''
    }
  });

  const [readingPreferences, setReadingPreferences] = useState({
    favoriteGenres: [],
    readingGoal: 12,
    currentlyReading: 0
  });

  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletterSubscription: true,
    publicProfile: true,
    twoFactorAuth: false
  });

  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    completedBooks: 0,
    publishedWords: 0,
    joinDate: null,
    lastLogin: null
  });

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help',
    'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        social: {
          twitter: user.social?.twitter || '',
          instagram: user.social?.instagram || '',
          goodreads: user.social?.goodreads || ''
        }
      });

      setReadingPreferences({
        favoriteGenres: user.readingPreferences?.favoriteGenres || [],
        readingGoal: user.readingPreferences?.readingGoal || 12,
        currentlyReading: user.readingPreferences?.currentlyReading || 0
      });

      setAccountSettings({
        emailNotifications: user.accountSettings?.emailNotifications ?? true,
        pushNotifications: user.accountSettings?.pushNotifications ?? false,
        newsletterSubscription: user.accountSettings?.newsletterSubscription ?? true,
        publicProfile: user.accountSettings?.publicProfile ?? true,
        twoFactorAuth: user.accountSettings?.twoFactorAuth ?? false
      });
    }

    fetchUserStatistics();
  }, [user]);

  const fetchUserStatistics = async () => {
    try {
      const response = await apiService.getUserStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.updateUserProfile(formData);
      
      if (response.success) {
        updateUser(response.data);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.uploadAvatar(file);
      
      if (response.success) {
        updateUser({ avatar: response.data.avatar });
        setSuccess('Avatar updated successfully!');
      } else {
        setError(response.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError(error.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.updateReadingPreferences(readingPreferences);
      
      if (response.success) {
        setSuccess('Reading preferences updated successfully!');
      } else {
        setError(response.error || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Preferences update error:', error);
      setError(error.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.updateAccountSettings(accountSettings);
      
      if (response.success) {
        setSuccess('Account settings updated successfully!');
      } else {
        setError(response.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Settings update error:', error);
      setError(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genre) => {
    const newGenres = readingPreferences.favoriteGenres.includes(genre)
      ? readingPreferences.favoriteGenres.filter(g => g !== genre)
      : [...readingPreferences.favoriteGenres, genre];
    
    setReadingPreferences({
      ...readingPreferences,
      favoriteGenres: newGenres
    });
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-700">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
            <Camera size={16} className="text-white" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{user?.name}</h2>
          <p className="text-gray-400">{user?.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm">
              Joined {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!editing}
                placeholder="City, Country"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!editing}
            rows="4"
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={!editing}
              placeholder="https://yourwebsite.com"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-gray-300 font-medium mb-4">
            Social Links
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={16} />
              <input
                type="text"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleChange}
                disabled={!editing}
                placeholder="@username"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={16} />
              <input
                type="text"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleChange}
                disabled={!editing}
                placeholder="@username"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" size={16} />
              <input
                type="text"
                name="social.goodreads"
                value={formData.social.goodreads}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Goodreads profile"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" color="white" /> : <Save size={16} />}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
        <Award className="mr-2 text-yellow-400" />
        Writing Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">
            {formatNumber(statistics.totalBooks)}
          </div>
          <div className="text-gray-400 text-sm">Total Books</div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">
            {formatNumber(statistics.completedBooks)}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {formatNumber(statistics.publishedWords)}
          </div>
          <div className="text-gray-400 text-sm">Words Published</div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">
            {statistics.avgRating || 0}
          </div>
          <div className="text-gray-400 text-sm">Avg Rating</div>
        </div>
      </div>

      {/* Reading Preferences */}
      <form onSubmit={handlePreferencesSubmit} className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-200">Reading Preferences</h4>
        
        <div>
          <label className="block text-gray-300 font-medium mb-3">
            Favorite Genres
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  readingPreferences.favoriteGenres.includes(genre)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Reading Goal (books per year)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={readingPreferences.readingGoal}
              onChange={(e) => setReadingPreferences({
                ...readingPreferences,
                readingGoal: parseInt(e.target.value) || 12
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Currently Reading
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={readingPreferences.currentlyReading}
              onChange={(e) => setReadingPreferences({
                ...readingPreferences,
                currentlyReading: parseInt(e.target.value) || 0
              })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="small" color="white" /> : <Save size={16} />}
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </form>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
        <Settings className="mr-2 text-gray-400" />
        Account Settings
      </h3>

      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-200">Notifications</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={accountSettings.emailNotifications}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  emailNotifications: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Email notifications</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={accountSettings.pushNotifications}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  pushNotifications: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Push notifications</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={accountSettings.newsletterSubscription}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  newsletterSubscription: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Newsletter subscription</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-200">Privacy</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={accountSettings.publicProfile}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  publicProfile: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Public profile</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={accountSettings.twoFactorAuth}
                onChange={(e) => setAccountSettings({
                  ...accountSettings,
                  twoFactorAuth: e.target.checked
                })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Two-factor authentication</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="small" color="white" /> : <Save size={16} />}
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
          <Shield className="mr-2" />
          Danger Zone
        </h4>
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <p className="text-gray-300 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <User className="text-blue-400" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Profile Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-lg">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;