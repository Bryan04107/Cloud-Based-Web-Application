import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function getBase64Image(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'backgrounds', filename)
    const fileBuffer = fs.readFileSync(filePath)
    return `data:image/jpeg;base64,${fileBuffer.toString('base64')}`
  } catch (error) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  }
}

async function main() {
  console.log(`🎲 Generating Set Room\n`)
  const id1 = crypto.randomUUID();
  const id2 = crypto.randomUUID();
  const id3 = crypto.randomUUID();

  const setHotspots = [
    {
      id: crypto.randomUUID(),
      name: "Guide Introduction",
      x: 50, y: 50,
      type: "guide",
      isBonus: false,
      points: 0,
      lockBehavior: "visible_locked",
      content: {
        question: "Welcome to the sample Escape Room!",
        solution: "",
        options: []
      }
    },
    {
      id: id1,
      name: "SCQ1 Coding Language",
      x: 30, y: 30,
      type: "mcq_single",
      isBonus: false,
      points: 30,
      lockBehavior: "visible_locked",
      content: {
        question: "What is a considered a coding language?",
        solution: "Python",
        options: ["Anaconda", "Cobra", "Mamba", "Python"]
      }
    },
    {
      id: crypto.randomUUID(),
      name: "SCQ2 OOP",
      x: 15, y: 15,
      type: "mcq_single",
      isBonus: true,
      points: 15,
      lockedBy: id1,
      lockBehavior: "visible_locked",
      content: {
        question: "Which OOP feature promotes code reusability?",
        solution: "Inheritance",
        options: ["Abstraction", "Encapsulation", "Inheritance", "Polymorphism"]
      }
    },
    {
      id: id2,
      name: "MCQ1 Data Types",
      x: 70, y: 30,
      type: "mcq_multi",
      isBonus: false,
      points: 30,
      lockBehavior: "visible_locked",
      content: {
        question: "Which of these are primitive data types in JavaScript?",
        solution: JSON.stringify(["String", "Number", "Boolean"]),
        options: ["String", "Array", "Number", "Boolean"]
      }
    },
    {
      id: crypto.randomUUID(),
      name: "MCQ2 Loops",
      x: 85, y: 15,
      type: "mcq_multi",
      isBonus: true,
      points: 15,
      lockedBy: id2,
      lockBehavior: "visible_locked",
      content: {
        question: "Select the valid loop structures.",
        solution: JSON.stringify(["For Loop", "While Loop"]),
        options: ["For Loop", "If Loop", "While Loop", "When Loop"]
      }
    },
    {
      id: id3,
      name: "Code Syntax Fix",
      x: 50, y: 70,
      type: "code",
      isBonus: false,
      points: 40,
      lockBehavior: "visible_locked",
      content: {
        question: "This javascript line is supposed to save \"jane\" into a variable.\nFix this syntax using camelcase variable name:\n\n`let user name = 'Jane';`",
        solution: "let userName = 'Jane';",
        options: [] 
      }
    },
    {
      id: crypto.randomUUID(),
      name: "Code Array Index",
      x: 50, y: 85,
      type: "code",
      isBonus: true,
      points: 20,
      lockedBy: id3,
      lockBehavior: "visible_locked",
      content: {
        question: "This javascript array contains ([Apple, Orange, Pear]).\nFix this code to log 'Apple':\n\n`console.log(fruits[1]);`",
        solution: "console.log(fruits[0]);",
        options: []
      }
    },    
    {
      id: crypto.randomUUID(),
      name: "Code Array Index",
      x: 50, y: 25,
      type: "code",
      isBonus: false,
      points: 50,
      lockBehavior: "visible_locked",
      content: {
        question: "Javascript have a different syntax for appending items to an array.\nBelow is a python method to append items to an array:\n\n`items.append('Sword');`\n\nChange this python method into javascript",
        solution: "items.push('Sword');",
        options: []
      }
    }
  ]

  const setRoom = await prisma.escapeRoom.create({
    data: {
      id: crypto.randomUUID(),
      title: "Sample Escape Room",
      timerMinutes: 3,
      penaltySeconds: 45,
      backgroundImage: getBase64Image("tempRoom1.jpeg"),
      hotspots: JSON.stringify(setHotspots),
    },
  })

  console.log(`   > Created room: ${setRoom.title} | ${setHotspots.length} Hotspots`)
  console.log(`\n✅ Succesfully Created Set Room\n`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })