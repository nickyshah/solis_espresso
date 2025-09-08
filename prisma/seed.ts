import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  // Clear (optional for dev)
  await prisma.menuSize.deleteMany();
  await prisma.menuItem.deleteMany();

  // Create examples
  await prisma.menuItem.create({
    data: {
      name: "Flat White",
      description: "Velvety milk over a rich ristretto shot.",
      category: "coffee",
      isFeatured: true,
      sizes: {
        create: [
          { size: "small", price: 4.2 },
          { size: "large", price: 5.0 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Americano",
      description: "Smooth, long espresso with hot water.",
      category: "espresso",
      isFeatured: false,
      sizes: {
        create: [
          { size: "small", price: 3.8 },
          { size: "large", price: 4.5 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Blueberry Muffin",
      description: "Baked fresh daily.",
      category: "pastries",
      isFeatured: false,
      sizes: {
        create: [{ size: "large", price: 4.0 }], // pastries might be single size
      },
    },
  });
}

run()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log("Seeded 👍");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
