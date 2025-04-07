import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SetupForm } from './setup-form'

export default async function SetupPage() {
  // Check if any admin user exists
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  // If admin exists, redirect to home
  if (adminExists) {
    redirect('/')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Text Annotation Platform
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's set up your admin account to get started.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  )
} 