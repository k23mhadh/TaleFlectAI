const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { bookAuth, aiRateLimit } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to create AI context from book data
const createBookContext = (book) => {
  let context = `Title: ${book.title}\n`;
  context += `Genre: ${book.genre}\n`;
  context += `Target Audience: ${book.targetAudience}\n`;
  context += `Description: ${book.description}\n`;
  context += `Tone: ${book.tone}\n`;
  context += `Style: ${book.style}\n`;

  if (book.characters && book.characters.length > 0) {
    context += '\nCharacters:\n';
    book.characters.forEach(char => {
      context += `- ${char.name} (${char.role}): ${char.description}\n`;
    });
  }

  if (book.settings && book.settings.length > 0) {
    context += '\nSettings:\n';
    book.settings.forEach(setting => {
      context += `- ${setting.name}: ${setting.description}\n`;
    });
  }

  if (book.plotPoints && book.plotPoints.length > 0) {
    context += '\nPlot Points:\n';
    book.plotPoints.forEach((point, index) => {
      context += `${index + 1}. ${point.title}: ${point.description}\n`;
    });
  }

  if (book.outline) {
    context += `\nOutline: ${book.outline}\n`;
  }

  return context;
};

// Helper function to get model with safety settings
const getAIModel = (creativity = 0.7) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: creativity,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  });
  
  return model;
};

// @desc    Generate chapter content
// @route   POST /api/ai/generate-chapter/:bookId/:chapterId
// @access  Private
router.post('/generate-chapter/:bookId/:chapterId', [
  aiRateLimit,
  bookAuth,
  body('prompt')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Prompt cannot exceed 1000 characters'),
  body('creativity')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Creativity must be between 0 and 1')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { bookId, chapterId } = req.params;
  const { prompt = '', creativity = 0.7 } = req.body;

  // Check permissions
  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to generate content for this book', 403));
  }

  const book = req.book;
  const chapter = book.chapters.id(chapterId);

  if (!chapter) {
    return next(new AppError('Chapter not found', 404));
  }

  try {
    // Create context for AI
    const bookContext = createBookContext(book);
    
    // Get existing chapter content
    const existingContent = chapter.content || '';
    const chapterTitle = chapter.title;
    
    // Build the AI prompt
    let aiPrompt = `You are a professional creative writer. Generate engaging content for a book chapter based on the following context:\n\n${bookContext}\n\n`;
    
    aiPrompt += `Chapter Title: ${chapterTitle}\n`;
    
    if (existingContent) {
      aiPrompt += `Existing content:\n${existingContent}\n\n`;
      aiPrompt += `Continue this chapter naturally, maintaining consistency with the existing content, characters, and story flow.\n`;
    } else {
      aiPrompt += `This is a new chapter. Create compelling opening content that fits with the book's overall narrative.\n`;
    }
    
    if (prompt) {
      aiPrompt += `Specific instructions: ${prompt}\n`;
    }
    
    aiPrompt += `\nGenerate approximately 500-800 words of high-quality narrative content. Ensure the writing style matches the book's tone (${book.tone}) and is appropriate for the target audience (${book.targetAudience}). Include dialogue, character development, and scene descriptions as appropriate for the genre (${book.genre}).`;

    // Generate content using Gemini
    const model = getAIModel(creativity);
    const result = await model.generateContent(aiPrompt);
    const generatedText = result.response.text();

    if (!generatedText) {
      return next(new AppError('Failed to generate content. Please try again.', 500));
    }

    // Update chapter with generated content
    const newContent = existingContent ? `${existingContent}\n\n${generatedText.trim()}` : generatedText.trim();
    
    chapter.content = newContent;
    chapter.wordCount = newContent.split(/\s+/).filter(word => word.length > 0).length;
    chapter.isGenerated = true;
    chapter.generationPrompt = prompt;
    chapter.status = 'in-progress';

    await book.save();

    res.status(200).json({
      success: true,
      data: {
        chapterId,
        content: newContent,
        wordCount: chapter.wordCount,
        generatedContent: generatedText.trim()
      }
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return next(new AppError('Failed to generate content. Please try again later.', 500));
  }
}));

// @desc    Generate book outline
// @route   POST /api/ai/generate-outline/:bookId
// @access  Private
router.post('/generate-outline/:bookId', [
  aiRateLimit,
  bookAuth,
  body('prompt')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Prompt cannot exceed 1000 characters')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to generate content for this book', 403));
  }

  const book = req.book;
  const { prompt = '' } = req.body;

  try {
    const bookContext = createBookContext(book);
    
    let aiPrompt = `You are a professional book editor and story planner. Create a detailed outline for the following book:\n\n${bookContext}\n\n`;
    
    if (prompt) {
      aiPrompt += `Additional requirements: ${prompt}\n\n`;
    }
    
    aiPrompt += `Generate a comprehensive book outline that includes:
1. Chapter breakdown with titles and brief descriptions
2. Key plot points and story progression
3. Character development arcs
4. Conflict resolution structure
5. Themes and messages

Format the outline clearly with chapters, plot points, and character development. Make it suitable for the ${book.genre} genre and ${book.targetAudience} audience.`;

    const model = getAIModel(0.6); // Lower creativity for structured outlines
    const result = await model.generateContent(aiPrompt);
    const generatedOutline = result.response.text();

    if (!generatedOutline) {
      return next(new AppError('Failed to generate outline. Please try again.', 500));
    }

    // Update book outline
    book.outline = generatedOutline;
    await book.save();

    res.status(200).json({
      success: true,
      data: {
        outline: generatedOutline
      }
    });
  } catch (error) {
    console.error('AI outline generation error:', error);
    return next(new AppError('Failed to generate outline. Please try again later.', 500));
  }
}));

// @desc    Generate character descriptions
// @route   POST /api/ai/generate-character/:bookId
// @access  Private
router.post('/generate-character/:bookId', [
  aiRateLimit,
  bookAuth,
  body('characterName')
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage('Character name is required and cannot exceed 100 characters'),
  body('role')
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage('Character role is required and cannot exceed 100 characters'),
  body('prompt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Prompt cannot exceed 500 characters')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to generate content for this book', 403));
  }

  const book = req.book;
  const { characterName, role, prompt = '' } = req.body;

  try {
    const bookContext = createBookContext(book);
    
    let aiPrompt = `You are a creative writing assistant. Create a detailed character description for the following book:\n\n${bookContext}\n\n`;
    
    aiPrompt += `Character Name: ${characterName}\n`;
    aiPrompt += `Role: ${role}\n`;
    
    if (prompt) {
      aiPrompt += `Additional details: ${prompt}\n`;
    }
    
    aiPrompt += `\nGenerate a comprehensive character description including:
- Physical appearance
- Personality traits
- Background and history
- Motivations and goals
- Strengths and weaknesses
- How they fit into the story

Make the character compelling and well-rounded, suitable for the ${book.genre} genre.`;

    const model = getAIModel(0.8);
    const result = await model.generateContent(aiPrompt);
    const characterDescription = result.response.text();

    if (!characterDescription) {
      return next(new AppError('Failed to generate character description. Please try again.', 500));
    }

    // Add or update character
    const existingCharacterIndex = book.characters.findIndex(char => char.name === characterName);
    
    if (existingCharacterIndex !== -1) {
      book.characters[existingCharacterIndex].description = characterDescription;
      book.characters[existingCharacterIndex].role = role;
    } else {
      book.characters.push({
        name: characterName,
        role: role,
        description: characterDescription
      });
    }

    await book.save();

    res.status(200).json({
      success: true,
      data: {
        character: {
          name: characterName,
          role: role,
          description: characterDescription
        }
      }
    });
  } catch (error) {
    console.error('AI character generation error:', error);
    return next(new AppError('Failed to generate character description. Please try again later.', 500));
  }
}));

// @desc    Generate dialogue
// @route   POST /api/ai/generate-dialogue/:bookId
// @access  Private
router.post('/generate-dialogue/:bookId', [
  aiRateLimit,
  bookAuth,
  body('characters')
    .isArray({ min: 2 })
    .withMessage('At least 2 characters are required for dialogue'),
  body('scene')
    .notEmpty()
    .isLength({ max: 500 })
    .withMessage('Scene description is required and cannot exceed 500 characters'),
  body('tone')
    .optional()
    .isIn(['casual', 'formal', 'tense', 'romantic', 'humorous', 'dramatic'])
    .withMessage('Invalid tone specified')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to generate content for this book', 403));
  }

  const book = req.book;
  const { characters, scene, tone = 'natural' } = req.body;

  try {
    const bookContext = createBookContext(book);
    
    let aiPrompt = `You are a dialogue specialist. Generate realistic dialogue for the following book:\n\n${bookContext}\n\n`;
    
    aiPrompt += `Scene: ${scene}\n`;
    aiPrompt += `Characters involved: ${characters.join(', ')}\n`;
    aiPrompt += `Dialogue tone: ${tone}\n\n`;
    
    aiPrompt += `Generate natural dialogue between these characters that:
- Reveals character personality and relationships
- Advances the plot or develops characters
- Feels authentic to the book's genre and setting
- Matches the specified tone
- Includes appropriate action tags and descriptions

Format the dialogue properly with character names and quotation marks.`;

    const model = getAIModel(0.8);
    const result = await model.generateContent(aiPrompt);
    const dialogue = result.response.text();

    if (!dialogue) {
      return next(new AppError('Failed to generate dialogue. Please try again.', 500));
    }

    res.status(200).json({
      success: true,
      data: {
        dialogue: dialogue.trim(),
        characters,
        scene,
        tone
      }
    });
  } catch (error) {
    console.error('AI dialogue generation error:', error);
    return next(new AppError('Failed to generate dialogue. Please try again later.', 500));
  }
}));

// @desc    Improve/rewrite content
// @route   POST /api/ai/improve-content/:bookId
// @access  Private
router.post('/improve-content/:bookId', [
  aiRateLimit,
  bookAuth,
  body('content')
    .notEmpty()
    .isLength({ max: 5000 })
    .withMessage('Content is required and cannot exceed 5000 characters'),
  body('instruction')
    .notEmpty()
    .isLength({ max: 500 })
    .withMessage('Improvement instruction is required and cannot exceed 500 characters')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  if (req.userRole !== 'author' && (!req.permissions || !req.permissions.canEdit)) {
    return next(new AppError('You do not have permission to generate content for this book', 403));
  }

  const book = req.book;
  const { content, instruction } = req.body;

  try {
    const bookContext = createBookContext(book);
    
    let aiPrompt = `You are a professional editor. Improve the following content according to the instruction provided.\n\n`;
    aiPrompt += `Book context:\n${bookContext}\n\n`;
    aiPrompt += `Original content:\n${content}\n\n`;
    aiPrompt += `Improvement instruction: ${instruction}\n\n`;
    aiPrompt += `Provide the improved version that maintains the original meaning while addressing the requested improvements. Ensure the writing style remains consistent with the book's tone and genre.`;

    const model = getAIModel(0.6);
    const result = await model.generateContent(aiPrompt);
    const improvedContent = result.response.text();

    if (!improvedContent) {
      return next(new AppError('Failed to improve content. Please try again.', 500));
    }

    res.status(200).json({
      success: true,
      data: {
        originalContent: content,
        improvedContent: improvedContent.trim(),
        instruction
      }
    });
  } catch (error) {
    console.error('AI content improvement error:', error);
    return next(new AppError('Failed to improve content. Please try again later.', 500));
  }
}));

// @desc    Get AI usage statistics
// @route   GET /api/ai/usage
// @access  Private
router.get('/usage', asyncHandler(async (req, res) => {
  const user = req.user;
  
  // Get current usage (simplified - in production, you'd track this more comprehensively)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const usage = {
    today: user.aiUsage?.count || 0,
    limit: 50, // Free tier limit
    remaining: Math.max(0, 50 - (user.aiUsage?.count || 0)),
    resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Tomorrow
  };

  res.status(200).json({
    success: true,
    data: usage
  });
}));

module.exports = router;