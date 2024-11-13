import { NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user.service'

// GET - Fetch all non-admin users
export async function GET() {
  try {
    const users = await UserService.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Detailed error in GET /api/users:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new user
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const user = await UserService.createUser(data)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 