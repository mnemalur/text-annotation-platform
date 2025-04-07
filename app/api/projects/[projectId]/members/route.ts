import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const memberAddSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'ANNOTATOR']),
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

    // Check if user is project owner or admin
    const currentMember = await prisma.projectMember.findFirst({
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

    if (!currentMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const json = await req.json()
    const body = memberAddSchema.parse(json)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        userId: user.id,
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 })
    }

    // Add user to project
    const member = await prisma.projectMember.create({
      data: {
        projectId: params.projectId,
        userId: user.id,
        role: body.role,
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
    })

    return NextResponse.json(member)
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

    // Check if user is project member
    const currentMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        user: {
          email: session.user.email!,
        },
      },
    })

    if (!currentMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const members = await prisma.projectMember.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const memberId = url.searchParams.get('id')
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Check if user is project owner or admin
    const currentMember = await prisma.projectMember.findFirst({
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

    if (!currentMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if trying to remove project owner
    const memberToRemove = await prisma.projectMember.findUnique({
      where: { id: memberId },
    })

    if (!memberToRemove) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (memberToRemove.role === 'OWNER') {
      return NextResponse.json({ error: 'Cannot remove project owner' }, { status: 403 })
    }

    await prisma.projectMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 