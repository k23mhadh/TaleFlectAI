import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Eye,
  Download,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatNumber, formatDate, calculateReadingTime } from '../../utils';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [analytics, setAnalytics] = useState({
    overview: {
      totalBooks: 0,
      completedBooks: 0,
      inProgressBooks: 0,
      totalWords: 0,
      totalViews: 0,
      totalDownloads: 0,
      avgRating: 0
    },
    writing: {
      dailyWordCount: [],
      weeklyProgress: [],
      genreDistribution: [],
      productivityScore: 0
    },
    books: {
      topPerforming: [],
      recentActivity: [],
      completionRate: 0
    },
    ai: {
      totalUsage: 0,
      remainingCredits: 0,
      mostUsedFeatures: []
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get user statistics
      const statsResponse = await apiService.getUserStatistics();
      
      // Get user books for analysis
      const booksResponse = await apiService.getBooks();
      
      // Get AI usage
      const aiUsageResponse = await apiService.getAIUsage();
      
      // Get user activity
      const activityResponse = await apiService.getUserActivity(1, 10);

      if (statsResponse.success && booksResponse.success) {
        // Process the data
        const books = booksResponse.data;
        const stats = statsResponse.data;
        
        // Calculate overview metrics
        const overview = {
          totalBooks: books.length,
          completedBooks: books.filter(b => b.status === 'completed' || b.status === 'published').length,
          inProgressBooks: books.filter(b => b.status === 'in-progress').length,
          totalWords: books.reduce((total, book) => total + (book.wordCount || 0), 0),
          totalViews: books.reduce((total, book) => total + (book.analytics?.views || 0), 0),
          totalDownloads: books.reduce((total, book) => total + (book.analytics?.downloads || 0), 0),
          avgRating: books.reduce((total, book) => total + (book.analytics?.rating || 0), 0) / books.length || 0
        };

        // Generate mock data for charts (replace with real data from backend)
        const writing = {
          dailyWordCount: generateMockDailyData(parseInt(timeRange)),
          weeklyProgress: generateMockWeeklyData(),
          genreDistribution: calculateGenreDistribution(books),
          productivityScore: calculateProductivityScore(books)
        };

        // Get top performing books
        const topPerforming = books
          .filter(book => book.analytics)
          .sort((a, b) => (b.analytics.views || 0) - (a.analytics.views || 0))
          .slice(0, 5);

        const booksAnalytics = {
          topPerforming,
          recentActivity: activityResponse.success ? activityResponse.data : [],
          completionRate: overview.totalBooks > 0 ? (overview.completedBooks / overview.totalBooks) * 100 : 0
        };

        const aiAnalytics = {
          totalUsage: aiUsageResponse.success ? aiUsageResponse.data.today : 0,
          remainingCredits: aiUsageResponse.success ? aiUsageResponse.data.remaining : 50,
          mostUsedFeatures: [
            { name: 'Chapter Generation', count: 15 },
            { name: 'Content Improvement', count: 8 },
            { name: 'Character Creation', count: 5 }
          ]
        };

        setAnalytics({
          overview,
          writing,
          books: booksAnalytics,
          ai: aiAnalytics
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mock data (replace with real backend data)
  const generateMockDailyData = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        words: Math.floor(Math.random() * 1000) + 200
      });
    }
    return data;
  };

  const generateMockWeeklyData = () => {
    return [
      { week: 'Week 1', target: 7000, actual: 6500 },
      { week: 'Week 2', target: 7000, actual: 7200 },
      { week: 'Week 3', target: 7000, actual: 6800 },
      { week: 'Week 4', target: 7000, actual: 7500 }
    ];
  };

  const calculateGenreDistribution = (books) => {
    const genres = {};
    books.forEach(book => {
      if (book.genre) {
        genres[book.genre] = (genres[book.genre] || 0) + 1;
      }
    });
    
    return Object.entries(genres).map(([genre, count]) => ({
      genre,
      count,
      percentage: (count / books.length * 100).toFixed(1)
    }));
  };

  const calculateProductivityScore = (books) => {
    // Simple productivity calculation based on completion rate and word count
    const completedBooks = books.filter(b => b.status === 'completed' || b.status === 'published').length;
    const totalWords = books.reduce((total, book) => total + (book.wordCount || 0), 0);
    
    const completionScore = books.length > 0 ? (completedBooks / books.length) * 50 : 0;
    const wordScore = Math.min((totalWords / 50000) * 50, 50); // Max 50 points for 50k+ words
    
    return Math.round(completionScore + wordScore);
  };

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
              <BarChart3 className="mr-3 text-blue-400" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Track your writing progress and book performance</p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Books</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.overview.totalBooks}</p>
              </div>
              <BookOpen className="text-blue-400" size={24} />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-400">{analytics.overview.completedBooks} completed</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-yellow-400">{analytics.overview.inProgressBooks} in progress</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Words</p>
                <p className="text-2xl font-bold text-green-400">{formatNumber(analytics.overview.totalWords)}</p>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              ~{calculateReadingTime(analytics.overview.totalWords)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-purple-400">{formatNumber(analytics.overview.totalViews)}</p>
              </div>
              <Eye className="text-purple-400" size={24} />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <Download className="text-gray-400 mr-1" size={12} />
              <span className="text-gray-400">{formatNumber(analytics.overview.totalDownloads)} downloads</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Productivity Score</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.writing.productivityScore}/100</p>
              </div>
              <Zap className="text-yellow-400" size={24} />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full" 
                style={{ width: `${analytics.writing.productivityScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Writing Progress */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <Activity className="mr-2 text-blue-400" />
              Daily Writing Progress
            </h3>
            <div className="space-y-2">
              {analytics.writing.dailyWordCount.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {formatDate(day.date, { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((day.words / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-sm w-16 text-right">
                      {formatNumber(day.words)} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <PieChart className="mr-2 text-green-400" />
              Genre Distribution
            </h3>
            <div className="space-y-3">
              {analytics.writing.genreDistribution.slice(0, 5).map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{genre.genre}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${genre.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">
                      {genre.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Books */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <Award className="mr-2 text-purple-400" />
              Top Performing Books
            </h3>
            <div className="space-y-4">
              {analytics.books.topPerforming.length > 0 ? (
                analytics.books.topPerforming.map((book, index) => (
                  <div key={book._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-100">{book.title}</h4>
                        <p className="text-sm text-gray-400">{book.genre}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye size={12} className="text-gray-400" />
                          <span className="text-gray-300">{formatNumber(book.analytics?.views || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-yellow-400" />
                          <span className="text-gray-300">{(book.analytics?.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatNumber(book.wordCount || 0)} words
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto text-gray-600 mb-2" size={32} />
                  <p className="text-gray-400">No published books yet</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Usage */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <Zap className="mr-2 text-yellow-400" />
              AI Usage
            </h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
                <p className="text-yellow-400 text-2xl font-bold">{analytics.ai.remainingCredits}</p>
                <p className="text-gray-400 text-sm">Credits Remaining</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-200 mb-2">Most Used Features</h4>
                <div className="space-y-2">
                  {analytics.ai.mostUsedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{feature.name}</span>
                      <span className="text-yellow-400 text-sm">{feature.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <Clock className="mr-2 text-gray-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {analytics.books.recentActivity.length > 0 ? (
              analytics.books.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">
                    {activity.type === 'created' && 'Created'}
                    {activity.type === 'updated' && 'Updated'}
                    {activity.type === 'published' && 'Published'}
                    {' '}
                    <span className="font-medium">{activity.title}</span>
                  </span>
                  <span className="text-gray-400 text-sm ml-auto">
                    {formatDate(activity.date)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;