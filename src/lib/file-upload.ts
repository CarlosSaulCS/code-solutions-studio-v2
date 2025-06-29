import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv'
]
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]

export interface FileUploadResult {
  success: boolean
  fileName?: string
  filePath?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  error?: string
}

export interface FileUploadOptions {
  category?: 'GENERAL' | 'DESIGN' | 'DOCUMENT' | 'CODE' | 'ASSET'
  projectId?: string
  userId?: string
  optimize?: boolean // For images
  maxWidth?: number // For image optimization
  maxHeight?: number // For image optimization
}

// Ensure upload directory exists
export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }

  // Create subdirectories
  const subdirs = ['images', 'documents', 'temp']
  for (const subdir of subdirs) {
    const dirPath = path.join(UPLOAD_DIR, subdir)
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }
}

// Validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB` 
    }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
    }
  }

  return { valid: true }
}

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName)
  const uuid = uuidv4()
  const timestamp = Date.now()
  return `${timestamp}-${uuid}${ext}`
}

// Get file category based on MIME type
export function getFileCategory(mimeType: string): string {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return 'DESIGN'
  }
  if (mimeType === 'application/pdf') {
    return 'DOCUMENT'
  }
  if (mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('text')) {
    return 'DOCUMENT'
  }
  return 'GENERAL'
}

// Optimize image if needed
async function optimizeImage(
  inputPath: string, 
  outputPath: string, 
  options: { maxWidth?: number; maxHeight?: number }
): Promise<void> {
  const { maxWidth = 1920, maxHeight = 1080 } = options
  
  await sharp(inputPath)
    .resize(maxWidth, maxHeight, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality: 85, progressive: true })
    .png({ compressionLevel: 8 })
    .webp({ quality: 85 })
    .toFile(outputPath)
}

// Upload file from FormData
export async function uploadFile(
  file: File, 
  options: FileUploadOptions = {}
): Promise<FileUploadResult> {
  try {
    // Ensure upload directory exists
    await ensureUploadDir()

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate filename and paths
    const fileName = generateFileName(file.name)
    const category = options.category || getFileCategory(file.type)
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const subdir = isImage ? 'images' : 'documents'
    const filePath = path.join(UPLOAD_DIR, subdir, fileName)
    const fileUrl = `/uploads/${subdir}/${fileName}`

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save file
    if (isImage && options.optimize) {
      // Save original temporarily
      const tempPath = path.join(UPLOAD_DIR, 'temp', fileName)
      await fs.writeFile(tempPath, buffer)
      
      // Optimize and save
      await optimizeImage(tempPath, filePath, {
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight
      })
      
      // Remove temp file
      await fs.unlink(tempPath)
    } else {
      // Save directly
      await fs.writeFile(filePath, buffer)
    }

    // Get final file stats
    const stats = await fs.stat(filePath)

    return {
      success: true,
      fileName,
      filePath,
      fileUrl,
      fileSize: stats.size,
      fileType: file.type
    }
  } catch (error) {
    console.error('File upload error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }
  }
}

// Delete file
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath)
    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

// Get file info
export async function getFileInfo(filePath: string): Promise<{
  exists: boolean
  size?: number
  modified?: Date
  type?: string
}> {
  try {
    const stats = await fs.stat(filePath)
    const ext = path.extname(filePath).toLowerCase()
    
    // Guess MIME type from extension
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.csv': 'text/csv'
    }

    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime,
      type: mimeTypes[ext] || 'application/octet-stream'
    }
  } catch {
    return { exists: false }
  }
}

// Clean up old temp files (run periodically)
export async function cleanupTempFiles(olderThanHours: number = 24): Promise<void> {
  try {
    const tempDir = path.join(UPLOAD_DIR, 'temp')
    const files = await fs.readdir(tempDir)
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000)

    for (const file of files) {
      const filePath = path.join(tempDir, file)
      const stats = await fs.stat(filePath)
      
      if (stats.mtime.getTime() < cutoffTime) {
        await fs.unlink(filePath)
        console.log(`Cleaned up temp file: ${file}`)
      }
    }
  } catch (error) {
    console.error('Temp cleanup error:', error)
  }
}

// Scan directory recursively
const scanDir = async (dirPath: string, result: { totalSize: number; fileCount: number }): Promise<void> => {
  const items = await fs.readdir(dirPath, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name)
    
    if (item.isDirectory()) {
      await scanDir(fullPath, result)
    } else {
      const stats = await fs.stat(fullPath)
      result.totalSize += stats.size
      result.fileCount++
    }
  }
}

// Get upload directory size
export async function getUploadDirSize(): Promise<{ totalSize: number; fileCount: number }> {
  try {
    const result = { totalSize: 0, fileCount: 0 }

    await scanDir(UPLOAD_DIR, result)
    return result
  } catch (error) {
    console.error('Directory scan error:', error)
    return { totalSize: 0, fileCount: 0 }
  }
}

// Get file stream for download
export async function getFileStream(filePath: string): Promise<{
  success: boolean;
  stream?: ReadableStream;
  error?: string;
}> {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath)
    
    // Check if file exists
    await fs.access(fullPath)
    
    // Read file as buffer
    const buffer = await fs.readFile(fullPath)
    
    // Create a readable stream from buffer
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer)
        controller.close()
      }
    })
    
    return { success: true, stream }
  } catch (error) {
    console.error('File stream error:', error)
    return { success: false, error: 'File not found or inaccessible' }
  }
}
