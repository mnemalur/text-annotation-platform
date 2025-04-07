import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create annotator user
  const annotatorPassword = await bcrypt.hash('annotator123', 10)
  const annotator = await prisma.user.upsert({
    where: { email: 'annotator@example.com' },
    update: {},
    create: {
      email: 'annotator@example.com',
      name: 'Test Annotator',
      password: annotatorPassword,
      role: 'ANNOTATOR',
    },
  })

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Sample Medical Research Project',
      description: 'A sample project for testing the annotation platform',
      isDoubleAnnotation: true,
      labels: {
        create: [
          {
            name: 'Disease',
            color: '#FF0000',
            order: 1,
          },
          {
            name: 'Treatment',
            color: '#00FF00',
            order: 2,
          },
          {
            name: 'Symptom',
            color: '#0000FF',
            order: 3,
          },
        ],
      },
      members: {
        create: [
          {
            userId: admin.id,
            role: 'OWNER',
          },
          {
            userId: annotator.id,
            role: 'ANNOTATOR',
          },
        ],
      },
    },
  })

  // Create sample documents
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        title: 'Sample Medical Case 1',
        content: 'Patient presented with symptoms of fever and cough. Diagnosed with influenza. Prescribed antiviral medication.',
        projectId: project.id,
        status: 'PENDING',
        assignments: {
          create: {
            annotatorId: annotator.id,
            status: 'PENDING',
          },
        },
      },
    }),
    prisma.document.create({
      data: {
        title: 'Sample Medical Case 2',
        content: 'Patient reported severe headache and sensitivity to light. Diagnosed with migraine. Recommended rest and pain medication.',
        projectId: project.id,
        status: 'PENDING',
        assignments: {
          create: {
            annotatorId: annotator.id,
            status: 'PENDING',
          },
        },
      },
    }),
  ])

  console.log('Seed data created successfully!')
  console.log('Admin user:', admin.email)
  console.log('Annotator user:', annotator.email)
  console.log('Project:', project.name)
  console.log('Documents created:', documents.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 