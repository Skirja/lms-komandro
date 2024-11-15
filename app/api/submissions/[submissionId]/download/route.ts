import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import path from "path"
import fs from "fs"

export async function GET(
  req: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const submission = await db.submission.findUnique({
      where: {
        id: params.submissionId,
      },
      include: {
        user: true,
      },
    })

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    // Get the file path from the URL
    const filePath = path.join(process.cwd(), submission.fileUrl)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)

    // Get filename from path
    const fileName = path.basename(filePath)

    // Create response with file
    const response = new NextResponse(fileBuffer)

    // Set headers
    response.headers.set('Content-Type', 'application/octet-stream')
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`)

    return response
  } catch (error) {
    console.error("[DOWNLOAD_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
