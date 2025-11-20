import { PrismaClient, Category } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  // Clear existing data
  await prisma.menuSize.deleteMany({});
  await prisma.menuItem.deleteMany({});
  
  // Try to clear milk upcharges if the table exists
  try {
    await prisma.$executeRaw`DELETE FROM "MilkUpcharge"`;
  } catch (e) {
    console.log("MilkUpcharge table may not exist yet");
  }

  // Create milk upcharge options using raw SQL
  try {
    await prisma.$executeRaw`
      INSERT INTO "MilkUpcharge" ("milkType", "upcharge") VALUES 
      ('regular', 0.0),
      ('oat', 0.5),
      ('almond', 0.5),
      ('soy', 0.5),
      ('lactose_free', 0.5)
    `;
  } catch (e) {
    console.log("Could not create milk upcharges:", e);
  }

  // Create menu items
  const flatWhite = await prisma.menuItem.create({
    data: {
      name: "Flat White",
      description: "Rich espresso with steamed milk and microfoam",
      category: "coffee",
      isFeatured: true,
      ingredients: ["espresso", "steamed milk"],
    },
  });

  const americano = await prisma.menuItem.create({
    data: {
      name: "Americano",
      description: "Espresso shots with hot water",
      category: "coffee",
      isFeatured: false,
      ingredients: ["espresso", "hot water"],
    },
  });

  const muffin = await prisma.menuItem.create({
    data: {
      name: "Blueberry Muffin",
      description: "Fresh baked with Maine blueberries",
      category: "pastries",
      isFeatured: false,
      ingredients: ["flour", "blueberries", "sugar"],
    },
  });

  const cappuccino = await prisma.menuItem.create({
    data: {
      name: "Cappuccino",
      description: "Espresso with steamed milk and foam",
      category: "coffee",
      isFeatured: true,
      ingredients: ["espresso", "steamed milk"],
    },
  });

  const latte = await prisma.menuItem.create({
    data: {
      name: "Latte",
      description: "Espresso with steamed milk",
      category: "coffee",
      isFeatured: true,
      ingredients: ["espresso", "steamed milk"],
    },
  });

  const coldBrew = await prisma.menuItem.create({
    data: {
      name: "Cold Brew",
      description: "Smooth, cold-steeped coffee",
      category: "coffee",
      isFeatured: false,
      ingredients: ["cold brew coffee"],
    },
  });

  const croissant = await prisma.menuItem.create({
    data: {
      name: "Butter Croissant",
      description: "Flaky, buttery pastry",
      category: "pastries",
      isFeatured: false,
      ingredients: ["flour", "butter"],
    },
  });

  const avocadoToast = await prisma.menuItem.create({
    data: {
      name: "Avocado Toast",
      description: "Smashed avocado on sourdough",
      category: "sandwiches",
      isFeatured: false,
      ingredients: ["avocado", "sourdough bread"],
    },
  });

  const tea = await prisma.menuItem.create({
    data: {
      name: "Earl Grey Tea",
      description: "Classic bergamot tea",
      category: "tea",
      isFeatured: false,
      ingredients: ["earl grey tea"],
    },
  });

  // Create sizes for each item using raw SQL to handle enum values
  await prisma.$executeRaw`
    INSERT INTO "MenuSize" ("menuItemId", "size", "price") VALUES 
    (${flatWhite.id}, 'small', 4.25),
    (${flatWhite.id}, 'large', 4.75),
    (${americano.id}, 'small', 3.25),
    (${americano.id}, 'large', 3.75),
    (${muffin.id}, 'single', 3.50),
    (${cappuccino.id}, 'small', 4.75),
    (${cappuccino.id}, 'large', 5.25),
    (${latte.id}, 'small', 4.50),
    (${latte.id}, 'large', 5.00),
    (${coldBrew.id}, 'small', 2.75),
    (${coldBrew.id}, 'large', 3.25),
    (${croissant.id}, 'single', 6.75),
    (${avocadoToast.id}, 'single', 8.50),
    (${tea.id}, 'small', 3.75),
    (${tea.id}, 'large', 4.25)
  `;

  console.log("Seeded 👍");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
