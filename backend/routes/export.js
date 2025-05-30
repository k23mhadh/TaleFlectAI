const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { bookAuth } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Helper function to clean HTML content for export
const cleanContent = (htmlContent) => {
  if (!htmlContent) return '';
  return htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Helper function to generate PDF
const generatePDF = async (book, options = {}) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  const {
    includeTableOfContents = true,
    includeCover = true,
    includeChapterBreaks = true,
    fontSize = 12
  } = options;

  let currentPage = null;
  let yPosition = 750;
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const margin = 50;
  const maxWidth = pageWidth - (margin * 2);
  const lineHeight = fontSize * 1.2;

  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
    return currentPage;
  };

  const addText = (text, font = timesRomanFont, size = fontSize, color = rgb(0, 0, 0)) => {
    if (!currentPage) addNewPage();
    
    const words = text.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, size);
      
      if (textWidth > maxWidth && line) {
        // Draw current line
        currentPage.drawText(line, {
          x: margin,
          y: yPosition,
          size,
          font,
          color
        });
        
        yPosition -= lineHeight;
        line = word;
        
        // Check if we need a new page
        if (yPosition < margin + lineHeight) {
          addNewPage();
        }
      } else {
        line = testLine;
      }
    }
    
    // Draw remaining text
    if (line) {
      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size,
        font,
        color
      });
      yPosition -= lineHeight;
    }
  };

  const addPageBreak = () => {
    addNewPage();
  };

  // Cover page
  if (includeCover) {
    addNewPage();
    
    // Title
    currentPage.drawText(book.title, {
      x: margin,
      y: pageHeight - 200,
      size: 24,
      font: timesRomanBold,
      color: rgb(0, 0, 0)
    });
    
    // Author
    const author = typeof book.author === 'object' && book.author.name ? book.author.name : 'AI Generated';
    currentPage.drawText(`by ${author}`, {
      x: margin,
      y: pageHeight - 240,
      size: 16,
      font: timesRomanFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    // Description
    yPosition = pageHeight - 300;
    addText(book.description, timesRomanFont, 12);
    
    addPageBreak();
  }

  // Table of contents
  if (includeTableOfContents && book.chapters && book.chapters.length > 0) {
    addNewPage();
    
    currentPage.drawText('Table of Contents', {
      x: margin,
      y: yPosition,
      size: 20,
      font: timesRomanBold,
      color: rgb(0, 0, 0)
    });
    
    yPosition -= 40;
    
    book.chapters.forEach((chapter, index) => {
      if (chapter.content && chapter.content.trim()) {
        const tocEntry = `${index + 1}. ${chapter.title}`;
        addText(tocEntry, timesRomanFont, 12);
        yPosition -= 10;
      }
    });
    
    addPageBreak();
  }

  // Chapters
  if (book.chapters) {
    book.chapters.forEach((chapter, index) => {
      if (!chapter.content || !chapter.content.trim()) return;
      
      if (includeChapterBreaks && index > 0) {
        addPageBreak();
      }
      
      // Chapter title
      if (!currentPage) addNewPage();
      
      currentPage.drawText(chapter.title, {
        x: margin,
        y: yPosition,
        size: 18,
        font: timesRomanBold,
        color: rgb(0, 0, 0)
      });
      
      yPosition -= 30;
      
      // Chapter content
      const cleanedContent = cleanContent(chapter.content);
      addText(cleanedContent, timesRomanFont, fontSize);
      
      yPosition -= 20; // Space after chapter
    });
  }

  return pdfDoc;
};

// Helper function to generate DOCX
const generateDOCX = async (book, options = {}) => {
  const {
    includeTableOfContents = true,
    includeCover = true,
    includeChapterBreaks = true,
    fontSize = 12
  } = options;

  const children = [];

  // Cover page
  if (includeCover) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.title,
            bold: true,
            size: 48
          })
        ],
        heading: HeadingLevel.TITLE
      })
    );
    
    const author = typeof book.author === 'object' && book.author.name ? book.author.name : 'AI Generated';
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `by ${author}`,
            size: 24
          })
        ]
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.description,
            size: fontSize * 2
          })
        ]
      })
    );
    
    // Page break
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '', break: 1 })]
      })
    );
  }

  // Table of contents
  if (includeTableOfContents && book.chapters && book.chapters.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Table of Contents',
            bold: true,
            size: 32
          })
        ],
        heading: HeadingLevel.HEADING_1
      })
    );
    
    book.chapters.forEach((chapter, index) => {
      if (chapter.content && chapter.content.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${chapter.title}`,
                size: fontSize * 2
              })
            ]
          })
        );
      }
    });
    
    // Page break
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '', break: 1 })]
      })
    );
  }

  // Chapters
  if (book.chapters) {
    book.chapters.forEach((chapter, index) => {
      if (!chapter.content || !chapter.content.trim()) return;
      
      if (includeChapterBreaks && index > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '', break: 1 })]
          })
        );
      }
      
      // Chapter title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: chapter.title,
              bold: true,
              size: 28
            })
          ],
          heading: HeadingLevel.HEADING_1
        })
      );
      
      // Chapter content
      const cleanedContent = cleanContent(chapter.content);
      const paragraphs = cleanedContent.split('\n\n');
      
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: fontSize * 2
                })
              ]
            })
          );
        }
      });
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return doc;
};

// @desc    Export book as PDF
// @route   POST /api/export/:bookId/pdf
// @access  Private (Author/Collaborator with view permission)
router.post('/:bookId/pdf', [
  bookAuth,
  body('includeTableOfContents')
    .optional()
    .isBoolean()
    .withMessage('Include table of contents must be boolean'),
  body('includeCover')
    .optional()
    .isBoolean()
    .withMessage('Include cover must be boolean'),
  body('includeChapterBreaks')
    .optional()
    .isBoolean()
    .withMessage('Include chapter breaks must be boolean'),
  body('fontSize')
    .optional()
    .isInt({ min: 8, max: 24 })
    .withMessage('Font size must be between 8 and 24')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const book = req.book;
  const options = req.body;

  // Check if book has content
  const hasContent = book.chapters && book.chapters.some(chapter => chapter.content && chapter.content.trim().length > 0);
  if (!hasContent) {
    return next(new AppError('Cannot export a book with no content', 400));
  }

  try {
    const pdfDoc = await generatePDF(book, options);
    const pdfBytes = await pdfDoc.save();

    // Set headers for file download
    const filename = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBytes.length
    });

    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new AppError('Failed to generate PDF', 500));
  }
}));

// @desc    Export book as DOCX
// @route   POST /api/export/:bookId/docx
// @access  Private (Author/Collaborator with view permission)
router.post('/:bookId/docx', [
  bookAuth,
  body('includeTableOfContents')
    .optional()
    .isBoolean()
    .withMessage('Include table of contents must be boolean'),
  body('includeCover')
    .optional()
    .isBoolean()
    .withMessage('Include cover must be boolean'),
  body('includeChapterBreaks')
    .optional()
    .isBoolean()
    .withMessage('Include chapter breaks must be boolean'),
  body('fontSize')
    .optional()
    .isInt({ min: 8, max: 24 })
    .withMessage('Font size must be between 8 and 24')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const book = req.book;
  const options = req.body;

  // Check if book has content
  const hasContent = book.chapters && book.chapters.some(chapter => chapter.content && chapter.content.trim().length > 0);
  if (!hasContent) {
    return next(new AppError('Cannot export a book with no content', 400));
  }

  try {
    const doc = await generateDOCX(book, options);
    const docxBuffer = await Packer.toBuffer(doc);

    // Set headers for file download
    const filename = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': docxBuffer.length
    });

    res.status(200).send(docxBuffer);
  } catch (error) {
    console.error('DOCX generation error:', error);
    return next(new AppError('Failed to generate DOCX', 500));
  }
}));

// @desc    Export book as plain text
// @route   POST /api/export/:bookId/txt
// @access  Private (Author/Collaborator with view permission)
router.post('/:bookId/txt', [
  bookAuth,
  body('includeTableOfContents')
    .optional()
    .isBoolean()
    .withMessage('Include table of contents must be boolean'),
  body('includeChapterBreaks')
    .optional()
    .isBoolean()
    .withMessage('Include chapter breaks must be boolean')
], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const book = req.book;
  const {
    includeTableOfContents = true,
    includeChapterBreaks = true
  } = req.body;

  // Check if book has content
  const hasContent = book.chapters && book.chapters.some(chapter => chapter.content && chapter.content.trim().length > 0);
  if (!hasContent) {
    return next(new AppError('Cannot export a book with no content', 400));
  }

  try {
    let textContent = '';
    
    // Title and author
    const author = typeof book.author === 'object' && book.author.name ? book.author.name : 'AI Generated';
    textContent += `${book.title}\n`;
    textContent += `by ${author}\n\n`;
    textContent += `${book.description}\n\n`;
    textContent += '=' .repeat(50) + '\n\n';

    // Table of contents
    if (includeTableOfContents && book.chapters && book.chapters.length > 0) {
      textContent += 'TABLE OF CONTENTS\n\n';
      
      book.chapters.forEach((chapter, index) => {
        if (chapter.content && chapter.content.trim()) {
          textContent += `${index + 1}. ${chapter.title}\n`;
        }
      });
      
      textContent += '\n' + '=' .repeat(50) + '\n\n';
    }

    // Chapters
    if (book.chapters) {
      book.chapters.forEach((chapter, index) => {
        if (!chapter.content || !chapter.content.trim()) return;
        
        if (includeChapterBreaks && index > 0) {
          textContent += '\n' + '-'.repeat(30) + '\n\n';
        }
        
        textContent += `${chapter.title}\n\n`;
        
        const cleanedContent = cleanContent(chapter.content);
        textContent += cleanedContent + '\n\n';
      });
    }

    // Set headers for file download
    const filename = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    
    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': Buffer.byteLength(textContent, 'utf8')
    });

    res.status(200).send(textContent);
  } catch (error) {
    console.error('TXT generation error:', error);
    return next(new AppError('Failed to generate text file', 500));
  }
}));

// @desc    Get export preview
// @route   GET /api/export/:bookId/preview
// @access  Private (Author/Collaborator with view permission)
router.get('/:bookId/preview', bookAuth, asyncHandler(async (req, res, next) => {
  const book = req.book;
  
  // Check if book has content
  const hasContent = book.chapters && book.chapters.some(chapter => chapter.content && chapter.content.trim().length > 0);
  if (!hasContent) {
    return next(new AppError('Cannot preview a book with no content', 400));
  }

  // Generate preview data
  const author = typeof book.author === 'object' && book.author.name ? book.author.name : 'AI Generated';
  
  const preview = {
    title: book.title,
    author: author,
    description: book.description,
    wordCount: book.wordCount || 0,
    chapterCount: book.chapters ? book.chapters.filter(ch => ch.content && ch.content.trim()).length : 0,
    chapters: book.chapters
      ? book.chapters
          .filter(ch => ch.content && ch.content.trim())
          .map(ch => ({
            title: ch.title,
            wordCount: ch.wordCount || 0,
            preview: cleanContent(ch.content).substring(0, 200) + '...'
          }))
      : [],
    estimatedPages: Math.ceil((book.wordCount || 0) / 250), // Approximate pages
    estimatedReadingTime: Math.ceil((book.wordCount || 0) / 200) // Reading time in minutes
  };

  res.status(200).json({
    success: true,
    data: preview
  });
}));

// @desc    Get available export formats
// @route   GET /api/export/formats
// @access  Private
router.get('/formats', asyncHandler(async (req, res) => {
  const formats = [
    {
      format: 'pdf',
      name: 'PDF',
      description: 'Portable Document Format - Great for printing and sharing',
      options: [
        'includeTableOfContents',
        'includeCover',
        'includeChapterBreaks',
        'fontSize'
      ]
    },
    {
      format: 'docx',
      name: 'Microsoft Word',
      description: 'Word document format - Editable and widely supported',
      options: [
        'includeTableOfContents',
        'includeCover',
        'includeChapterBreaks',
        'fontSize'
      ]
    },
    {
      format: 'txt',
      name: 'Plain Text',
      description: 'Simple text format - Universal compatibility',
      options: [
        'includeTableOfContents',
        'includeChapterBreaks'
      ]
    }
  ];

  res.status(200).json({
    success: true,
    data: formats
  });
}));

module.exports = router;