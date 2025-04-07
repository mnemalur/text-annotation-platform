import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check users
    console.log('\n=== Users ===')
    const users = await prisma.user.findMany()
    for (const user of users) {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
    }

    // Check projects
    console.log('\n=== Projects ===')
    const projects = await prisma.project.findMany({
      include: {
        labels: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    for (const project of projects) {
      console.log(`\nProject: ${project.name}`)
      console.log(`Description: ${project.description}`)
      console.log('Labels:', project.labels.map(l => `${l.name} (${l.color})`).join(', '))
      console.log('Members:', project.members.map(m => 
        `${m.user.name} (${m.role})`
      ).join(', '))
    }

    // Check documents
    console.log('\n=== Documents ===')
    const documents = await prisma.document.findMany({
      include: {
        assignments: {
          include: {
            annotator: true
          }
        }
      }
    })

    for (const doc of documents) {
      console.log(`\nDocument: ${doc.title}`)
      console.log(`Status: ${doc.status}`)
      console.log('Assignments:', doc.assignments.map(a => 
        `${a.annotator.name} (${a.status})`
      ).join(', '))
    }

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