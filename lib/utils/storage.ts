import fs from 'fs'
import path from 'path'
import { writeFile } from "fs/promises"
import { unlink } from "fs/promises"

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function saveFile(buffer: Buffer, filename: string): Promise<string> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename)

    // Write file to disk
    await writeFile(filepath, buffer)

    return `/uploads/${filename}`
  } catch (error) {
    console.error("Error saving file:", error)
    throw new Error("Failed to save file")
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename)
    await unlink(filepath)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}
