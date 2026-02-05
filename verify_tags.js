
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const tracks = await prisma.track.findMany({
        include: { tags: true }
    })

    console.log('Total Tracks:', tracks.length)
    tracks.forEach(t => {
        console.log(`Track: ${t.title}, Path: ${t.filePath}, Tags: ${JSON.stringify(t.tags)}`)
    })

    const tags = await prisma.tag.findMany()
    console.log('Total Tags:', tags.length, tags)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
