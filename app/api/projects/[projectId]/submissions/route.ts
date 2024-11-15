import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveFile } from "@/lib/utils/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return new NextResponse("Missing or invalid file", { status: 400 });
    }

    // Check if project exists and belongs to user's track
    const project = await db.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        submissions: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if student has already submitted
    if (project.submissions.length > 0) {
      return new NextResponse("You have already submitted this project", { status: 400 });
    }

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get file type from formData
    const fileType = file.type || 'application/zip';

    // Validate file type
    const allowedTypes = ["application/zip", "application/x-zip-compressed", "application/x-rar-compressed"];
    if (!allowedTypes.includes(fileType)) {
      return new NextResponse(
        "Invalid file type. Only .zip and .rar files are allowed",
        { status: 400 }
      );
    }

    // Get filename from formData or generate one
    const originalName = (file as File).name || 'submission.zip';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${originalName}`;

    // Save file and get the URL
    const fileUrl = await saveFile(buffer, filename);

    // Create submission
    const submission = await db.submission.create({
      data: {
        fileUrl,
        projectId: params.projectId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("[SUBMISSION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const submissions = await db.submission.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[SUBMISSIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
