import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check users
    console.log('\nChecking users...')
    const users = await prisma.$queryRaw`
      SELECT name, email, role FROM User
    `
    console.log('Users:', users)

    // Check projects
    console.log('\nChecking projects...')
    const projects = await prisma.$queryRaw`
      SELECT name, description FROM Project
    `
    console.log('Projects:', projects)

    // Check labels
    console.log('\nChecking labels...')
    const labels = await prisma.$queryRaw`
      SELECT name, color FROM Label
    `
    console.log('Labels:', labels)

    // Check documents
    console.log('\nChecking documents...')
    const documents = await prisma.$queryRaw`
      SELECT title, status FROM Document
    `
    console.log('Documents:', documents)

  } catch (error) {
    console.error('Error:', error)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 