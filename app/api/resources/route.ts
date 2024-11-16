import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const track = formData.get("track") as string
    const content = formData.get("content") as string
    const thumbnail = formData.get("thumbnail") as File

    if (!title || !description || !track || !content || !thumbnail) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Save thumbnail
    const bytes = await thumbnail.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = join("public", "uploads", thumbnail.name)
    await writeFile(path, buffer)
    const thumbnailPath = `/uploads/${thumbnail.name}`

    const resource = await db.resource.create({
      data: {
        title,
        description,
        track,
        content,
        thumbnail: thumbnailPath,
      },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error creating resource:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const resources = await db.resource.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
