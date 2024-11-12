import { NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user.service'

// DELETE - Delete user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await UserService.deleteUser(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// PATCH - Update user
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const user = await UserService.updateUser(params.id, data)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 