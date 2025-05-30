const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header or cookie
    let token = req.header('Authorization');
    
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Token is not valid. User not found.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          success: false, 
          error: 'Account is deactivated.' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError.message);
      return res.status(401).json({ 
        success: false, 
        error: 'Token is not valid.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error in authentication' 
    });
  }
};

// Optional auth middleware (doesn't require authentication)
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (tokenError) {
        // Token invalid, but continue without user
        console.log('Optional auth token invalid:', tokenError.message);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error.message);
    next();
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. Authentication required.' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error in admin authentication' 
    });
  }
};

// Book owner or collaborator middleware
const bookAuth = async (req, res, next) => {
  try {
    const Book = require('../models/Book');
    const bookId = req.params.id || req.params.bookId;
    
    if (!bookId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Book ID is required' 
      });
    }

    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'Book not found' 
      });
    }

    // Check if user is the author
    if (book.author.toString() === req.user._id.toString()) {
      req.book = book;
      req.userRole = 'author';
      return next();
    }

    // Check if user is a collaborator
    const collaborator = book.collaborators.find(
      collab => collab.user && collab.user.toString() === req.user._id.toString()
    );

    if (collaborator) {
      req.book = book;
      req.userRole = collaborator.role;
      req.permissions = collaborator.permissions;
      return next();
    }

    // Check if book is public for read-only access
    if (book.visibility === 'public' && req.method === 'GET') {
      req.book = book;
      req.userRole = 'reader';
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      error: 'Access denied. You do not have permission to access this book.' 
    });
  } catch (error) {
    console.error('Book auth middleware error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error in book authentication' 
    });
  }
};

// Simple AI rate limiting middleware
const aiRateLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Initialize AI usage if not exists
    if (!user.aiUsage) {
      user.aiUsage = { date: today, count: 0 };
    }
    
    // Reset count if it's a new day
    if (user.aiUsage.date < today) {
      user.aiUsage = { date: today, count: 0 };
    }
    
    // Check if user has exceeded daily limit (50 requests for free users)
    const dailyLimit = user.subscriptionTier === 'premium' ? 500 : 50;
    
    if (user.aiUsage.count >= dailyLimit) {
      return res.status(429).json({ 
        success: false, 
        error: `Daily AI usage limit of ${dailyLimit} requests exceeded. Please upgrade your plan or try again tomorrow.`,
        resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      });
    }
    
    // Increment usage count
    user.aiUsage.count += 1;
    await user.save({ validateBeforeSave: false });
    
    next();
  } catch (error) {
    console.error('AI rate limit middleware error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error in AI rate limiting' 
    });
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
  adminAuth,
  bookAuth,
  aiRateLimit
};