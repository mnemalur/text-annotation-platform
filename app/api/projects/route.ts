import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const projectCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isDoubleAnnotation: z.boolean().default(false),
  labels: z.array(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    hotkey: z.string().optional(),
    color: z.string(),
  })),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const body = projectCreateSchema.parse(json)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        isDoubleAnnotation: body.isDoubleAnnotation,
        labels: {
          create: body.labels.map((label, index) => ({
            ...label,
            order: index,
          })),
        },
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        labels: true,
        members: {
          include: {
            user: {
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

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        projects: {
          include: {
            project: {
              include: {
                labels: true,
                documents: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const projects = user.projects.map(({ project }) => ({
      ...project,
      stats: {
        totalDocuments: project.documents.length,
        completedDocuments: project.documents.filter(d => d.status === 'COMPLETED').length,
        pendingDocuments: project.documents.filter(d => d.status === 'PENDING').length,
        inProgressDocuments: project.documents.filter(d => d.status === 'IN_PROGRESS').length,
      },
    }))

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 