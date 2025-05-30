// Format numbers with commas
export const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  };
  
  // Calculate reading time from word count
  export const calculateReadingTime = (wordCount) => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    if (minutes < 60) {
      return `${minutes} min read`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m read`
        : `${hours}h read`;
    }
  };
  
  // Count words in text
  export const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  // Truncate text to specified length
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  
  // Format date
  export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  };
  
  // Format relative time (e.g., "2 hours ago")
  export const formatRelativeTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };
  
  // Generate slug from title
  export const generateSlug = (title) => {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };
  
  // Validate email
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate password strength
  export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= minLength]
      .filter(Boolean).length;
    
    return {
      isValid: errors.length === 0,
      errors,
      strength: Math.min(strength, 5)
    };
  };
  
  // Debounce function
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Throttle function
  export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // Generate random ID
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Deep clone object
  export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  };
  
  // Get file size in human readable format
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Check if file is image
  export const isImageFile = (file) => {
    if (!file || !file.type) return false;
    return file.type.startsWith('image/');
  };
  
  // Validate file size
  export const validateFileSize = (file, maxSizeInMB = 10) => {
    if (!file) return { isValid: false, error: 'No file provided' };
    
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeInMB}MB`
      };
    }
    
    return { isValid: true };
  };
  
  // Get book progress color
  export const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-600';
    if (progress < 25) return 'bg-red-600';
    if (progress < 50) return 'bg-yellow-600';
    if (progress < 75) return 'bg-blue-600';
    if (progress < 100) return 'bg-green-600';
    return 'bg-green-600';
  };
  
  // Get status badge color
  export const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-700 text-gray-300';
      case 'in-progress':
        return 'bg-blue-700 text-blue-200';
      case 'completed':
        return 'bg-green-700 text-green-200';
      case 'published':
        return 'bg-purple-700 text-purple-200';
      case 'archived':
        return 'bg-gray-600 text-gray-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };
  
  // Local storage helpers
  export const storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    },
    
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };
  
  // URL helpers
  export const getBookUrl = (bookId) => `/books/${bookId}`;
  export const getChapterUrl = (bookId, chapterId) => `/books/${bookId}/chapters/${chapterId}`;
  export const getUserUrl = (userId) => `/users/${userId}`;
  
  // Error handling helpers
  export const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    if (error?.data?.error) return error.data.error;
    return 'An unexpected error occurred';
  };
  
  // Form validation helpers
  export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  };
  
  export const validateMinLength = (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  };
  
  export const validateMaxLength = (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters`;
    }
    return null;
  };
  
  // Genre and audience constants
  export const GENRES = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
    'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help',
    'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'
  ];
  
  export const BOOK_TYPES = [
    { id: 'novel', label: 'Novel' },
    { id: 'short-story', label: 'Short Story' },
    { id: 'non-fiction', label: 'Non-Fiction Book' },
    { id: 'poetry', label: 'Poetry Collection' }
  ];
  
  export const TARGET_AUDIENCES = [
    'Children (Ages 5-8)', 'Middle Grade (Ages 9-12)', 'Young Adult (Ages 13-18)',
    'Adults', 'Professionals', 'Academic', 'General Audience'
  ];
  
  export const TONES = [
    { id: 'neutral', label: 'Neutral' },
    { id: 'serious', label: 'Serious' },
    { id: 'humorous', label: 'Humorous' },
    { id: 'dark', label: 'Dark' },
    { id: 'optimistic', label: 'Optimistic' },
    { id: 'nostalgic', label: 'Nostalgic' },
    { id: 'suspenseful', label: 'Suspenseful' }
  ];
  
  // Export all utilities as default
  const utils = {
    formatNumber,
    calculateReadingTime,
    countWords,
    truncateText,
    formatDate,
    formatRelativeTime,
    generateSlug,
    isValidEmail,
    validatePassword,
    debounce,
    throttle,
    generateId,
    deepClone,
    formatFileSize,
    isImageFile,
    validateFileSize,
    getProgressColor,
    getStatusColor,
    storage,
    getBookUrl,
    getChapterUrl,
    getUserUrl,
    getErrorMessage,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    GENRES,
    BOOK_TYPES,
    TARGET_AUDIENCES,
    TONES
  };
  
  export default utils;