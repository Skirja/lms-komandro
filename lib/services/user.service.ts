import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { Role, Track } from '@/lib/constants'

export class UserService {
  // Create user
  static async createUser(data: {
    email: string
    password: string
    name: string
    role?: Role
    track?: Track
  }) {
    const hashedPassword = await hash(data.password, 10)
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    })
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string) {
    return compare(password, hashedPassword)
  }

  // Get all users
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: 'STUDENT'
        },
        select: {
          id: true,
          name: true,
          email: true,
          track: true,
          role: true
        }
      })
      
      console.log('Users fetched successfully:', users.length)
      return users
      
    } catch (error) {
      console.error('Detailed error in getAllUsers:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      throw error // Re-throw to be handled by the API route
    }
  }

  // Get users by track
  static async getUsersByTrack(track: Track) {
    return prisma.user.findMany({
      where: {
        role: 'STUDENT',
        track
      },
      select: {
        id: true,
        name: true,
        email: true,
        track: true
      }
    })
  }

  // Delete user
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }

  // Update user
  static async updateUser(id: string, data: {
    name?: string
    email?: string
    track?: Track
  }) {
    return prisma.user.update({
      where: { id },
      data
    })
  }
} 