import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

const adjectives = ["Haunted", "Neglected", "Lost", "Forgotten", "Broken", "Secure", "Rundown"]
const nouns = ["Room", "Base", "Hall", "Office", "Zone", "Bunker", "Vault"]
const puzzleTypes = ["guide", "code", "mcq_single", "mcq_multi"]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBase64Image(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'backgrounds', filename)
    const fileBuffer = fs.readFileSync(filePath)
    return `data:image/jpg;base64,${fileBuffer.toString('base64')}`
  } catch (error) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}

async function main() {
  const args = process.argv.slice(2);
  const countInput = args[0] ? parseInt(args[0]) : 10;
  const roomCount = (isNaN(countInput) || countInput < 1) ? 10 : countInput;
  
  console.log(`🎲 Generating ${roomCount} Random Rooms\n`)
  const roomImages = ["tempRoom1.jpg", "tempRoom2.jpg", "tempRoom3.jpg", "tempRoom4.jpg", "tempRoom5.jpg", "tempRoom6.jpg"]

  for (let i = 0; i < roomCount; i++) {
    const title = `${adjectives[getRandomInt(0, adjectives.length - 1)]} ${nouns[getRandomInt(0, nouns.length - 1)]} ${getRandomInt(1, 1000)}`
    const hotspots = []
    const hotspotCount = getRandomInt(3, 10)
        
    const randomImageFile = roomImages[getRandomInt(0, roomImages.length - 1)]
    const base64Image = getBase64Image(randomImageFile)

    for (let j = 0; j < hotspotCount; j++) {
      const type = puzzleTypes[getRandomInt(0, puzzleTypes.length - 1)]
      let content = {}

      switch (type) {
        case "guide":
          content = {
            question: "This is a guide hotspot.",
            solution: "",
            options: []
          }
          break;

        case "code":
          content = {
            question: "This is a code challange hotspot. Type \"Answer\" below.",
            solution: "Answer",
            options: []
          }
          break;

        case "mcq_multi":
          content = {
            question: "This is a multiple choice question hotspot. Select \"Option A\" and \"Option B\" below.",
            solution: JSON.stringify(["Option A", "Option B"]), 
            options: ["Option A", "Option B", "Option C", "Option D"]
          }
          break;

        default:
          content = {
            question: "This is a single choice question hotspot. Select \"The Right Answer\" below.",
            solution: "The Right Answer",
            options: ["Wrong Answer 1", "The Right Answer", "Wrong Answer 2", "Wrong Answer 3"]
          }
      }

      hotspots.push({
        id: randomUUID(),
        name: `${type.toUpperCase()} Puzzle ${j + 1}`,
        x: getRandomInt(5, 95),
        y: getRandomInt(5, 95),
        type: type,
        isBonus: Math.random() > 0.7,
        points: getRandomInt(10, 50),
        lockBehavior: "visible_locked",
        content: content
      })
    }

    await prisma.escapeRoom.create({
      data: {
        title: title,
        timerMinutes: getRandomInt(1, 10),
        penaltySeconds: getRandomInt(20, 60),
        backgroundImage: base64Image,
        hotspots: JSON.stringify(hotspots),
      },
    })
    console.log(`   > Created room: ${title} | ${hotspotCount} Hotspots`)
  }
  console.log(`\n✅ Succesfully Created ${roomCount} Random Rooms\n`)
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })