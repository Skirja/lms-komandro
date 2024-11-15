import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const track = searchParams.get('track')

    let projects = []

    if (session.user.role === "ADMIN") {
      projects = await db.project.findMany({
        include: {
          submissions: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // For students, only show projects matching their track
      projects = await db.project.findMany({
        where: {
          track: session.user.track,
        },
        include: {
          submissions: {
            where: {
              userId: session.user.id,
            },
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { title, description, track, deadline } = body

    if (!title || !description || !track || !deadline) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        track,
        deadline: new Date(deadline),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
