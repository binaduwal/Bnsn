import { Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { FileUploadResult } from '../types';

const router = Router();

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

router.post('/images', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return next(createError('No image file provided', 400));
    }

    const file = req.files.image as UploadedFile;

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return next(createError('Invalid image type. Allowed: JPEG, PNG, GIF, WebP', 400));
    }

    const fileExtension = path.extname(file.name);
    const filename = `${uuidv4()}${fileExtension}`;
    const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'images', filename);

    await file.mv(uploadPath);

    const result: FileUploadResult = {
      filename,
      originalName: file.name,
      size: file.size,
      mimetype: file.mimetype,
      path: uploadPath,
      url: `/uploads/images/${filename}`
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.post('/documents', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (!req.files || !req.files.document) {
      return next(createError('No document file provided', 400));
    }

    const file = req.files.document as UploadedFile;

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      return next(createError('Invalid document type. Allowed: PDF, TXT, DOC, DOCX', 400));
    }

    const fileExtension = path.extname(file.name);
    const filename = `${uuidv4()}${fileExtension}`;
    const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'documents', filename);

    await file.mv(uploadPath);

    const result: FileUploadResult = {
      filename,
      originalName: file.name,
      size: file.size,
      mimetype: file.mimetype,
      path: uploadPath,
      url: `/uploads/documents/${filename}`
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;