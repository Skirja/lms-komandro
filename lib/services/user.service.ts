import { PrismaClient, User } from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import { Role, Track } from '@/lib/constants'

const prisma = new PrismaClient()

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
    return prisma.user.findMany({
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