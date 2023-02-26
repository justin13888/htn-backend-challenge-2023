import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface Skill {
  skill: string;
  rating: number;
}

interface User {
  name: string;
  company: string;
  email: string;
  phone: string;
  skills: Skill[];
}

async function main() {
  // Load the JSON file
  const jsonString = await fs.readFile('./users.json', 'utf8');
  const users = JSON.parse(jsonString) as User[];

  // Insert the users and their skills into the database
  for (const user of users) {
    const { name, company, email, phone, skills } = user;
    const userRecord = await prisma.user.create({
      data: {
        name,
        company,
        email,
        phone,
        skills: {
          create: skills.map((skill) => ({
            skill: skill.skill,
            rating: skill.rating,
          })),
        },
      },
    });
    console.log(`Created user ${userRecord.name} with ID ${userRecord.id}`);
  }
}

main()
  .then(async () => {
    // Close the database connection
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
