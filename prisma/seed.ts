import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { drillSeedData } from "../src/lib/drill-seed-data";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding ${drillSeedData.length} drills...`);
  for (const drill of drillSeedData) {
    const existing = await prisma.drill.findFirst({ where: { title: drill.title } });
    if (existing) {
      await prisma.drill.update({ where: { id: existing.id }, data: drill });
    } else {
      await prisma.drill.create({ data: drill });
    }
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
