import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

const setupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    // Check if admin already exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (adminExists) {
      return new NextResponse('Admin already exists', { status: 400 })
    }

    const json = await req.json()
    const body = setupSchema.parse(json)

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 