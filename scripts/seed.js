import { PrismaClient } from '@prisma/client'
import * as bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

// Define constants
const ADMIN_EMAIL = 'admin@komandro.com'
const ADMIN_PASSWORD = 'komandro@admin'
const ADMIN_NAME = 'Admin'

async function main() {
  try {
    // Create default admin account
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10)

    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {},
      create: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Default admin account created:', admin.email)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })