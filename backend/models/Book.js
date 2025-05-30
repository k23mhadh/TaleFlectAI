const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
    maxlength: [200, 'Chapter title cannot exceed 200 characters']
  },
  content: {
    type: String,
    default: ''
  },
  wordCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  generationPrompt: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Character description cannot exceed 1000 characters']
  },
  traits: [String],
  relationships: [{
    character: String,
    relationship: String
  }]
});

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Setting description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['location', 'time-period', 'world', 'other'],
    default: 'location'
  }
});

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  altText: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Book description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
           'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 
           'Horror', 'Children\'s', 'Young Adult', 'Poetry', 'Memoir', 'Other']
  },
  bookType: {
    type: String,
    required: [true, 'Book type is required'],
    enum: ['novel', 'short-story', 'non-fiction', 'poetry'],
    default: 'novel'
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    enum: ['Children (Ages 5-8)', 'Middle Grade (Ages 9-12)', 'Young Adult (Ages 13-18)',
           'Adults', 'Professionals', 'Academic', 'General Audience']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['co-author', 'editor', 'reviewer'],
      default: 'reviewer'
    },
    permissions: {
      canEdit: { type: Boolean, default: false },
      canComment: { type: Boolean, default: true },
      canView: { type: Boolean, default: true }
    }
  }],
  chapters: [chapterSchema],
  characters: [characterSchema],
  settings: [settingSchema],
  plotPoints: [{
    title: String,
    description: String,
    order: Number
  }],
  images: [imageSchema],
  coverImage: {
    type: String,
    default: null
  },
  coverPrompt: {
    type: String,
    default: ''
  },
  outline: {
    type: String,
    maxlength: [5000, 'Outline cannot exceed 5000 characters'],
    default: ''
  },
  tone: {
    type: String,
    enum: ['neutral', 'serious', 'humorous', 'dark', 'optimistic', 'nostalgic', 'suspenseful'],
    default: 'neutral'
  },
  style: {
    type: String,
    default: 'narrative'
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'unlisted'],
    default: 'private'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isbn: {
    type: String,
    default: null
  },
  publishedDate: {
    type: Date,
    default: null
  },
  version: {
    type: Number,
    default: 1
  },
  versions: [{
    version: Number,
    changes: String,
    snapshot: Object,
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: {
    language: {
      type: String,
      default: 'en'
    },
    publisher: {
      type: String,
      default: ''
    },
    rights: {
      type: String,
      default: 'All rights reserved'
    },
    price: {
      currency: { type: String, default: 'USD' },
      amount: { type: Number, default: 0 }
    }
  },
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiSettings: {
    useAI: { type: Boolean, default: true },
    model: { type: String, default: 'gemini-pro' },
    creativity: { type: Number, default: 0.7, min: 0, max: 1 },
    maxTokens: { type: Number, default: 2000 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookSchema.index({ author: 1, status: 1 });
bookSchema.index({ genre: 1, status: 1 });
bookSchema.index({ title: 'text', description: 'text' });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ updatedAt: -1 });

// Virtual for formatted word count
bookSchema.virtual('formattedWordCount').get(function() {
  return this.wordCount.toLocaleString();
});

// Virtual for estimated reading time
bookSchema.virtual('estimatedReadingTime').get(function() {
  return Math.ceil(this.wordCount / 200); // 200 words per minute
});

// Pre-save middleware to update word count and progress
bookSchema.pre('save', function(next) {
  // Calculate total word count from chapters
  this.wordCount = this.chapters.reduce((total, chapter) => {
    return total + (chapter.wordCount || 0);
  }, 0);
  
  // Calculate reading time
  this.readingTime = Math.ceil(this.wordCount / 200);
  
  // Calculate progress based on completed chapters
  if (this.chapters.length > 0) {
    const completedChapters = this.chapters.filter(ch => ch.status === 'completed' || ch.status === 'published').length;
    this.progress = Math.round((completedChapters / this.chapters.length) * 100);
  }
  
  next();
});

// Method to add a new chapter
bookSchema.methods.addChapter = function(chapterData) {
  const order = this.chapters.length + 1;
  this.chapters.push({ ...chapterData, order });
  return this.save();
};

// Method to update chapter content and word count
bookSchema.methods.updateChapter = function(chapterId, content) {
  const chapter = this.chapters.id(chapterId);
  if (!chapter) throw new Error('Chapter not found');
  
  chapter.content = content;
  chapter.wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  chapter.status = content.trim() ? 'in-progress' : 'draft';
  
  return this.save();
};

// Method to reorder chapters
bookSchema.methods.reorderChapters = function(chapterOrders) {
  chapterOrders.forEach(({ chapterId, order }) => {
    const chapter = this.chapters.id(chapterId);
    if (chapter) {
      chapter.order = order;
    }
  });
  
  this.chapters.sort((a, b) => a.order - b.order);
  return this.save();
};

// Method to create a version snapshot
bookSchema.methods.createVersion = function(changes = '') {
  const snapshot = {
    title: this.title,
    description: this.description,
    chapters: this.chapters,
    characters: this.characters,
    settings: this.settings,
    plotPoints: this.plotPoints
  };
  
  this.versions.push({
    version: this.version,
    changes,
    snapshot
  });
  
  this.version += 1;
  return this.save();
};

// Method to get public book data
bookSchema.methods.getPublicData = function() {
  const book = this.toObject();
  
  // Remove sensitive data
  delete book.versions;
  delete book.aiSettings;
  
  // Only show published chapters for public view
  if (this.visibility === 'public') {
    book.chapters = book.chapters.filter(ch => ch.status === 'published');
  }
  
  return book;
};

// Static method to find books by genre
bookSchema.statics.findByGenre = function(genre, limit = 10) {
  return this.find({ genre, visibility: 'public', status: 'published' })
             .populate('author', 'name avatar')
             .limit(limit)
             .sort({ publishedDate: -1 });
};

// Static method for search
bookSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    visibility: 'public',
    ...filters
  };
  
  return this.find(searchQuery)
             .populate('author', 'name avatar')
             .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Book', bookSchema);