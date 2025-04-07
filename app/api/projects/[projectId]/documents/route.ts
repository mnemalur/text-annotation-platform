import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const documentUploadSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  assignTo: z.array(z.string()).optional(),
})

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const body = documentUploadSchema.parse(json)

    // Check if user has access to project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        user: {
          email: session.user.email!,
        },
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    })

    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create document
    const document = await prisma.document.create({
      data: {
        title: body.title,
        content: body.content,
        projectId: params.projectId,
        status: 'PENDING',
        assignments: body.assignTo ? {
          create: body.assignTo.map((userId) => ({
            annotatorId: userId,
            status: 'PENDING',
          })),
        } : undefined,
      },
      include: {
        assignments: {
          include: {
            annotator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        user: {
          email: session.user.email!,
        },
      },
    })

    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const skip = (page - 1) * limit

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: {
          projectId: params.projectId,
          status: status as DocumentStatus | undefined,
        },
        include: {
          assignments: {
            include: {
              annotator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          annotations: {
            include: {
              label: true,
              annotator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.document.count({
        where: {
          projectId: params.projectId,
          status: status as DocumentStatus | undefined,
        },
      }),
    ])

    return NextResponse.json({
      documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 