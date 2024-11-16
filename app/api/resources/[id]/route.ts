import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return new NextResponse("Resource not found", { status: 404 })
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error fetching resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const track = formData.get("track") as string
    const content = formData.get("content") as string
    const thumbnail = formData.get("thumbnail") as File | null

    if (!title || !description || !track || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    let thumbnailPath: string | undefined

    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const path = join("public", "uploads", thumbnail.name)
      await writeFile(path, buffer)
      thumbnailPath = `/uploads/${thumbnail.name}`
    }

    const resource = await db.resource.update({
      where: { id: params.id },
      data: {
        title,
        description,
        track,
        content,
        ...(thumbnailPath && { thumbnail: thumbnailPath }),
      },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error updating resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.resource.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
