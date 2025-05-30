const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { body, query, validationResult } = require('express-validator');
const Book = require('../models/Book');
const User = require('../models/User');
const { bookAuth, optionalAuth } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/books');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  }
});

// @desc    Get all books for user
// @route   GET /api/books
// @access  Private
router.get('/', [
  query('status')
    .optional()
    .isIn(['draft', 'in-progress', 'completed', 'published', 'archived'])
    .withMessage('Invalid status filter'),
  query('genre')
    .optional()
    .isIn(['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
           'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
           'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'])
    .withMessage('Invalid genre filter'),
  query('sort')
    .optional()
    .isIn(['title', 'createdAt', 'updatedAt', 'progress', 'wordCount'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const {
    status,
    genre,
    sort = 'updatedAt',
    order = 'desc',
    limit = 20,
    page = 1,
    search
  } = req.query;

  // Build query
  const query = { author: req.user._id };
  
  if (status) query.status = status;
  if (genre) query.genre = genre;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [books, total] = await Promise.all([
    Book.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-versions -chapters.content') // Exclude large fields for list view
        .lean(),
    Book.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: books,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  });
}));

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private/Public (based on book visibility)
router.get('/:id', optionalAuth, bookAuth, asyncHandler(async (req, res) => {
  let book = req.book;

  // If public access, return limited data
  if (!req.user || req.userRole === 'reader') {
    book = book.getPublicData();
  }

  res.status(200).json({
    success: true,
    data: book,
    userRole: req.userRole || 'reader',
    permissions: req.permissions || {}
  });
}));

// @desc    Create new book
// @route   POST /api/books
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .isLength({ max: 2000 })
    .withMessage('Description is required and cannot exceed 2000 characters'),
  body('genre')
    .notEmpty()
    .isIn(['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
           'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
           'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'])
    .withMessage('Valid genre is required'),
  body('bookType')
    .optional()
    .isIn(['novel', 'short-story', 'non-fiction', 'poetry'])
    .withMessage('Invalid book type'),
  body('targetAudience')
    .notEmpty()
    .isIn(['Children (Ages 5-8)', 'Middle Grade (Ages 9-12)', 'Young Adult (Ages 13-18)',
           'Adults', 'Professionals', 'Academic', 'General Audience'])
    .withMessage('Valid target audience is required')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const bookData = {
    ...req.body,
    author: req.user._id
  };

  // Create default chapters if specified
  if (req.body.chapterTitles && Array.isArray(req.body.chapterTitles)) {
    bookData.chapters = req.body.chapterTitles.map((title, index) => ({
      title: title.trim(),
      content: '',
      wordCount: 0,
      order: index + 1,
      status: 'draft'
    }));
  }

  const book = await Book.create(bookData);

  // Update user statistics
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'statistics.booksInProgress': 1 }
  });

  res.status(201).json({
    success: true,
    data: book
  });
}));

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Author/Collaborator with edit permission)
router.put('/:id', [
  bookAuth,
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('genre')
    .optional()
    .isIn(['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
           'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
           'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other'])
    .withMessage('Invalid genre')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to edit this book', 403));
  }

  const book = req.book;
  const updateFields = req.body;

  // Remove fields that shouldn't be updated via this endpoint
  delete updateFields.author;
  delete updateFields.chapters;
  delete updateFields.collaborators;
  delete updateFields.analytics;

  // Update book
  Object.keys(updateFields).forEach(key => {
    if (updateFields[key] !== undefined) {
      book[key] = updateFields[key];
    }
  });

  await book.save();

  res.status(200).json({
    success: true,
    data: book
  });
}));

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Author only)
router.delete('/:id', bookAuth, asyncHandler(async (req, res, next) => {
  if (req.userRole !== 'author') {
    return next(new AppError('Only the author can delete this book', 403));
  }

  const book = req.book;

  // Delete associated files
  if (book.coverImage) {
    try {
      await fs.unlink(path.join(__dirname, '../uploads/books', book.coverImage));
    } catch (error) {
      console.error('Error deleting cover image:', error);
    }
  }

  // Delete book images
  for (const image of book.images) {
    try {
      await fs.unlink(path.join(__dirname, '../uploads/books', image.filename));
    } catch (error) {
      console.error('Error deleting book image:', error);
    }
  }

  await Book.findByIdAndDelete(book._id);

  // Update user statistics
  const updateQuery = book.status === 'published' 
    ? { $inc: { 'statistics.booksPublished': -1 } }
    : { $inc: { 'statistics.booksInProgress': -1 } };
    
  await User.findByIdAndUpdate(req.user._id, updateQuery);

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully'
  });
}));

// @desc    Add chapter to book
// @route   POST /api/books/:id/chapters
// @access  Private (Author/Collaborator with edit permission)
router.post('/:id/chapters', [
  bookAuth,
  body('title')
    .trim()
    .notEmpty()
    .isLength({ max: 200 })
    .withMessage('Chapter title is required and cannot exceed 200 characters'),
  body('content')
    .optional()
    .isString()
    .withMessage('Content must be a string')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to add chapters to this book', 403));
  }

  const book = req.book;
  const { title, content = '' } = req.body;

  const chapterData = {
    title,
    content,
    wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
    order: book.chapters.length + 1,
    status: content.trim() ? 'in-progress' : 'draft'
  };

  book.chapters.push(chapterData);
  await book.save();

  const newChapter = book.chapters[book.chapters.length - 1];

  res.status(201).json({
    success: true,
    data: newChapter
  });
}));

// @desc    Update chapter
// @route   PUT /api/books/:id/chapters/:chapterId
// @access  Private (Author/Collaborator with edit permission)
router.put('/:id/chapters/:chapterId', [
  bookAuth,
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Chapter title cannot exceed 200 characters'),
  body('content')
    .optional()
    .isString()
    .withMessage('Content must be a string')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to edit chapters in this book', 403));
  }

  const book = req.book;
  const chapter = book.chapters.id(req.params.chapterId);

  if (!chapter) {
    return next(new AppError('Chapter not found', 404));
  }

  // Update chapter fields
  if (req.body.title !== undefined) chapter.title = req.body.title;
  if (req.body.content !== undefined) {
    chapter.content = req.body.content;
    chapter.wordCount = req.body.content.split(/\s+/).filter(word => word.length > 0).length;
    chapter.status = req.body.content.trim() ? 'in-progress' : 'draft';
  }

  await book.save();

  res.status(200).json({
    success: true,
    data: chapter
  });
}));

// @desc    Delete chapter
// @route   DELETE /api/books/:id/chapters/:chapterId
// @access  Private (Author/Collaborator with edit permission)
router.delete('/:id/chapters/:chapterId', bookAuth, asyncHandler(async (req, res, next) => {
  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to delete chapters from this book', 403));
  }

  const book = req.book;
  const chapter = book.chapters.id(req.params.chapterId);

  if (!chapter) {
    return next(new AppError('Chapter not found', 404));
  }

  chapter.remove();
  
  // Reorder remaining chapters
  book.chapters.forEach((ch, index) => {
    ch.order = index + 1;
  });

  await book.save();

  res.status(200).json({
    success: true,
    message: 'Chapter deleted successfully'
  });
}));

// @desc    Reorder chapters
// @route   PUT /api/books/:id/chapters/reorder
// @access  Private (Author/Collaborator with edit permission)
router.put('/:id/chapters/reorder', [
  bookAuth,
  body('chapterOrder')
    .isArray({ min: 1 })
    .withMessage('Chapter order array is required'),
  body('chapterOrder.*')
    .isMongoId()
    .withMessage('Invalid chapter ID in order array')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to reorder chapters in this book', 403));
  }

  const book = req.book;
  const { chapterOrder } = req.body;

  // Validate that all chapter IDs exist
  for (const chapterId of chapterOrder) {
    if (!book.chapters.id(chapterId)) {
      return next(new AppError(`Chapter with ID ${chapterId} not found`, 400));
    }
  }

  // Update chapter order
  chapterOrder.forEach((chapterId, index) => {
    const chapter = book.chapters.id(chapterId);
    chapter.order = index + 1;
  });

  // Sort chapters by order
  book.chapters.sort((a, b) => a.order - b.order);

  await book.save();

  res.status(200).json({
    success: true,
    data: book.chapters
  });
}));

// @desc    Upload book cover
// @route   POST /api/books/:id/cover
// @access  Private (Author/Collaborator with edit permission)
router.post('/:id/cover', bookAuth, upload.single('cover'), asyncHandler(async (req, res, next) => {
  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to upload cover for this book', 403));
  }

  if (!req.file) {
    return next(new AppError('Please upload a cover image', 400));
  }

  const book = req.book;

  try {
    // Process image with Sharp
    const processedImagePath = path.join(
      path.dirname(req.file.path),
      'processed-' + req.file.filename
    );

    await sharp(req.file.path)
      .resize(400, 600, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(processedImagePath);

    // Delete original file
    await fs.unlink(req.file.path);

    // Delete old cover if exists
    if (book.coverImage) {
      try {
        await fs.unlink(path.join(__dirname, '../uploads/books', book.coverImage));
      } catch (error) {
        console.error('Error deleting old cover:', error);
      }
    }

    // Update book with new cover
    book.coverImage = 'processed-' + req.file.filename;
    await book.save();

    res.status(200).json({
      success: true,
      data: {
        coverImage: book.coverImage,
        url: `/uploads/books/${book.coverImage}`
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('Error cleaning up file:', unlinkError);
    }
    
    throw new AppError('Error processing cover image', 500);
  }
}));

// @desc    Upload book image
// @route   POST /api/books/:id/images
// @access  Private (Author/Collaborator with edit permission)
router.post('/:id/images', bookAuth, upload.single('image'), asyncHandler(async (req, res, next) => {
  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to upload images for this book', 403));
  }

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  const book = req.book;
  const { caption = '', altText = '' } = req.body;

  try {
    // Process image with Sharp
    const processedImagePath = path.join(
      path.dirname(req.file.path),
      'processed-' + req.file.filename
    );

    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(processedImagePath);

    // Delete original file
    await fs.unlink(req.file.path);

    // Add image to book
    const imageData = {
      name: req.file.originalname,
      filename: 'processed-' + req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/books/processed-${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      caption,
      altText
    };

    book.images.push(imageData);
    await book.save();

    const newImage = book.images[book.images.length - 1];

    res.status(201).json({
      success: true,
      data: newImage
    });
  } catch (error) {
    // Clean up uploaded file on error
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('Error cleaning up file:', unlinkError);
    }
    
    throw new AppError('Error processing image', 500);
  }
}));

// @desc    Delete book image
// @route   DELETE /api/books/:id/images/:imageId
// @access  Private (Author/Collaborator with edit permission)
router.delete('/:id/images/:imageId', bookAuth, asyncHandler(async (req, res, next) => {
  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to delete images from this book', 403));
  }

  const book = req.book;
  const image = book.images.id(req.params.imageId);

  if (!image) {
    return next(new AppError('Image not found', 404));
  }

  // Delete file from disk
  try {
    await fs.unlink(path.join(__dirname, '../uploads/books', image.filename));
  } catch (error) {
    console.error('Error deleting image file:', error);
  }

  // Remove from book
  image.remove();
  await book.save();

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully'
  });
}));

// @desc    Publish book
// @route   POST /api/books/:id/publish
// @access  Private (Author only)
router.post('/:id/publish', bookAuth, asyncHandler(async (req, res, next) => {
  if (req.userRole !== 'author') {
    return next(new AppError('Only the author can publish this book', 403));
  }

  const book = req.book;

  // Validation checks
  if (book.chapters.length === 0) {
    return next(new AppError('Cannot publish a book with no chapters', 400));
  }

  const hasContent = book.chapters.some(chapter => chapter.content.trim().length > 0);
  if (!hasContent) {
    return next(new AppError('Cannot publish a book with no content', 400));
  }

  // Update book status
  book.status = 'published';
  book.publishedDate = new Date();
  book.visibility = req.body.visibility || 'public';

  // Mark chapters as published
  book.chapters.forEach(chapter => {
    if (chapter.content.trim()) {
      chapter.status = 'published';
    }
  });

  await book.save();

  // Update user statistics
  const wasInProgress = book.status !== 'published';
  const updateQuery = wasInProgress 
    ? { 
        $inc: { 
          'statistics.booksPublished': 1,
          'statistics.booksInProgress': -1,
          'statistics.publishedWords': book.wordCount
        }
      }
    : { 
        $inc: { 
          'statistics.publishedWords': book.wordCount
        }
      };
      
  await User.findByIdAndUpdate(req.user._id, updateQuery);

  res.status(200).json({
    success: true,
    data: book,
    message: 'Book published successfully'
  });
}));

// @desc    Create book version/snapshot
// @route   POST /api/books/:id/versions
// @access  Private (Author/Collaborator with edit permission)
router.post('/:id/versions', [
  bookAuth,
  body('changes')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Changes description cannot exceed 500 characters')
], asyncHandler(async (req, res, next) => {
  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to create versions for this book', 403));
  }

  const book = req.book;
  const { changes = '' } = req.body;

  await book.createVersion(changes);

  res.status(201).json({
    success: true,
    data: {
      version: book.version,
      changes,
      createdAt: new Date()
    },
    message: 'Version created successfully'
  });
}));

module.exports = router;