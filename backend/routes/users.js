const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'books',
      select: 'title status progress wordCount createdAt updatedAt'
    });

  res.status(200).json({
    success: true,
    data: user.getPublicProfile()
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('website')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Website cannot exceed 200 characters')
    .isURL({ require_protocol: false })
    .withMessage('Please provide a valid website URL'),
  body('social.twitter')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Twitter handle cannot exceed 100 characters'),
  body('social.instagram')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Instagram handle cannot exceed 100 characters'),
  body('social.goodreads')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Goodreads username cannot exceed 100 characters')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const user = await User.findById(req.user.id);
  const updateData = req.body;

  // Remove fields that shouldn't be updated via this endpoint
  delete updateData.email;
  delete updateData.password;
  delete updateData.role;
  delete updateData.isVerified;
  delete updateData.statistics;

  // Update user fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      if (key === 'social' && typeof updateData[key] === 'object') {
        user.social = { ...user.social, ...updateData[key] };
      } else {
        user[key] = updateData[key];
      }
    }
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user.getPublicProfile()
  });
}));

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', upload.single('avatar'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an avatar image', 400));
  }

  const user = await User.findById(req.user.id);

  try {
    // Process image with Sharp
    const processedImagePath = path.join(
      path.dirname(req.file.path),
      'processed-' + req.file.filename
    );

    await sharp(req.file.path)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(processedImagePath);

    // Delete original file
    await fs.unlink(req.file.path);

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const oldAvatarPath = path.join(__dirname, '../uploads/avatars', path.basename(user.avatar));
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    // Update user with new avatar
    user.avatar = `/uploads/avatars/processed-${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('Error cleaning up file:', unlinkError);
    }
    
    throw new AppError('Error processing avatar image', 500);
  }
}));

// @desc    Delete user avatar
// @route   DELETE /api/users/avatar
// @access  Private
router.delete('/avatar', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.avatar) {
    try {
      const avatarPath = path.join(__dirname, '../uploads/avatars', path.basename(user.avatar));
      await fs.unlink(avatarPath);
    } catch (error) {
      console.error('Error deleting avatar file:', error);
    }

    user.avatar = null;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Avatar deleted successfully'
  });
}));

// @desc    Update reading preferences
// @route   PUT /api/users/reading-preferences
// @access  Private
router.put('/reading-preferences', [
  body('favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  body('favoriteGenres.*')
    .optional()
    .isIn(['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
           'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
           'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'])
    .withMessage('Invalid genre in favorite genres'),
  body('readingGoal')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Reading goal must be between 1 and 1000'),
  body('currentlyReading')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Currently reading must be between 0 and 100')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const user = await User.findById(req.user.id);
  const { favoriteGenres, readingGoal, currentlyReading } = req.body;

  // Update reading preferences
  if (favoriteGenres !== undefined) {
    user.readingPreferences.favoriteGenres = favoriteGenres;
  }
  if (readingGoal !== undefined) {
    user.readingPreferences.readingGoal = readingGoal;
  }
  if (currentlyReading !== undefined) {
    user.readingPreferences.currentlyReading = currentlyReading;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.readingPreferences
  });
}));

// @desc    Update account settings
// @route   PUT /api/users/settings
// @access  Private
router.put('/settings', [
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be boolean'),
  body('pushNotifications')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be boolean'),
  body('newsletterSubscription')
    .optional()
    .isBoolean()
    .withMessage('Newsletter subscription must be boolean'),
  body('publicProfile')
    .optional()
    .isBoolean()
    .withMessage('Public profile must be boolean'),
  body('twoFactorAuth')
    .optional()
    .isBoolean()
    .withMessage('Two factor auth must be boolean')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const user = await User.findById(req.user.id);
  const settings = req.body;

  // Update account settings
  Object.keys(settings).forEach(key => {
    if (settings[key] !== undefined && user.accountSettings[key] !== undefined) {
      user.accountSettings[key] = settings[key];
    }
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user.accountSettings
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
router.get('/statistics', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Get additional statistics from books
  const bookStats = await Book.aggregate([
    {
      $match: { author: user._id }
    },
    {
      $group: {
        _id: null,
        totalBooks: { $sum: 1 },
        publishedBooks: {
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
        },
        inProgressBooks: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        draftBooks: {
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
        },
        totalWords: { $sum: '$wordCount' },
        avgProgress: { $avg: '$progress' }
      }
    }
  ]);

  const stats = bookStats[0] || {
    totalBooks: 0,
    publishedBooks: 0,
    inProgressBooks: 0,
    draftBooks: 0,
    totalWords: 0,
    avgProgress: 0
  };

  // Combine with user statistics
  const combinedStats = {
    ...user.statistics.toObject(),
    ...stats,
    joinDate: user.createdAt,
    lastLogin: user.lastLogin
  };

  res.status(200).json({
    success: true,
    data: combinedStats
  });
}));

// @desc    Get user activity feed
// @route   GET /api/users/activity
// @access  Private
router.get('/activity', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  // Get recent book activities
  const books = await Book.find({ author: req.user.id })
    .select('title status updatedAt createdAt publishedDate')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip);

  // Transform to activity format
  const activities = books.map(book => {
    let activityType = 'updated';
    let activityDate = book.updatedAt;

    if (book.status === 'published' && book.publishedDate) {
      activityType = 'published';
      activityDate = book.publishedDate;
    } else if (book.createdAt.getTime() === book.updatedAt.getTime()) {
      activityType = 'created';
      activityDate = book.createdAt;
    }

    return {
      type: activityType,
      title: book.title,
      bookId: book._id,
      date: activityDate,
      status: book.status
    };
  });

  res.status(200).json({
    success: true,
    data: activities,
    pagination: {
      currentPage: page,
      hasMore: books.length === limit
    }
  });
}));

// @desc    Get public user profile
// @route   GET /api/users/:id/public
// @access  Public
router.get('/:id/public', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!user.accountSettings.publicProfile) {
    return next(new AppError('This user profile is private', 403));
  }

  // Get user's published books
  const publishedBooks = await Book.find({
    author: user._id,
    status: 'published',
    visibility: 'public'
  })
  .select('title description genre wordCount publishedDate analytics.rating analytics.ratingCount')
  .sort({ publishedDate: -1 })
  .limit(10);

  const publicProfile = user.getPublicProfile();
  
  // Remove sensitive information for public view
  delete publicProfile.email;
  delete publicProfile.accountSettings;
  delete publicProfile.isVerified;
  delete publicProfile.lastLogin;

  res.status(200).json({
    success: true,
    data: {
      user: publicProfile,
      books: publishedBooks
    }
  });
}));

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
router.get('/search', asyncHandler(async (req, res, next) => {
  const { q, limit = 20, page = 1 } = req.query;

  if (!q || q.trim().length < 2) {
    return next(new AppError('Search query must be at least 2 characters', 400));
  }

  const skip = (page - 1) * limit;

  const users = await User.find({
    $and: [
      { 'accountSettings.publicProfile': true },
      { isActive: true },
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { bio: { $regex: q, $options: 'i' } }
        ]
      }
    ]
  })
  .select('name avatar bio location statistics.booksPublished')
  .sort({ 'statistics.booksPublished': -1, createdAt: -1 })
  .limit(parseInt(limit))
  .skip(skip);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      hasMore: users.length === parseInt(limit)
    }
  });
}));

// @desc    Deactivate user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to deactivate account')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return next(new AppError('Invalid password', 401));
  }

  // Deactivate account instead of deleting
  user.isActive = false;
  user.refreshToken = undefined;
  await user.save();

  // Set books to archived
  await Book.updateMany(
    { author: user._id },
    { status: 'archived', visibility: 'private' }
  );

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

// @desc    Export user data
// @route   GET /api/users/export
// @access  Private
router.get('/export', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const books = await Book.find({ author: req.user.id });

  const exportData = {
    user: user.getPublicProfile(),
    books: books.map(book => ({
      title: book.title,
      description: book.description,
      genre: book.genre,
      status: book.status,
      wordCount: book.wordCount,
      chapters: book.chapters.map(ch => ({
        title: ch.title,
        content: ch.content,
        wordCount: ch.wordCount
      })),
      characters: book.characters,
      settings: book.settings,
      plotPoints: book.plotPoints,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    })),
    exportDate: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: exportData
  });
}));

module.exports = router;