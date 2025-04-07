import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const annotationCreateSchema = z.object({
  labelId: z.string(),
  startOffset: z.number().int().min(0),
  endOffset: z.number().int().min(0),
  text: z.string().min(1),
})

export async function POST(
  req: Request,
  { params }: { params: { projectId: string; documentId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const body = annotationCreateSchema.parse(json)

    // Check if user has access to document
    const assignment = await prisma.assignment.findFirst({
      where: {
        documentId: params.documentId,
        annotator: {
          email: session.user.email!,
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS'],
        },
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update assignment status if it's the first annotation
    if (assignment.status === 'PENDING') {
      await prisma.assignment.update({
        where: { id: assignment.id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    // Create annotation
    const annotation = await prisma.annotation.create({
      data: {
        labelId: body.labelId,
        startOffset: body.startOffset,
        endOffset: body.endOffset,
        text: body.text,
        documentId: params.documentId,
        annotatorId: assignment.annotatorId,
      },
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
    })

    return NextResponse.json(annotation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string; documentId: string } }
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

    const annotations = await prisma.annotation.findMany({
      where: {
        documentId: params.documentId,
      },
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
      orderBy: {
        startOffset: 'asc',
      },
    })

    return NextResponse.json(annotations)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string; documentId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const annotationId = url.searchParams.get('id')
    if (!annotationId) {
      return NextResponse.json({ error: 'Annotation ID is required' }, { status: 400 })
    }

    // Check if user owns the annotation
    const annotation = await prisma.annotation.findFirst({
      where: {
        id: annotationId,
        documentId: params.documentId,
        annotator: {
          email: session.user.email!,
        },
      },
    })

    if (!annotation) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.annotation.delete({
      where: { id: annotationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 