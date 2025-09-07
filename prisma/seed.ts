import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  await prisma.menuItem.createMany({
    data: [
      {
        name: "Signature Espresso",
        description: "Our premium house blend with a rich, smooth finish.",
        category: "espresso",
        price: 3.5,
        imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=600&fit=crop",
        isFeatured: true,
        ingredients: ["Colombian beans","Dark chocolate notes"] as any
      },
      {
        name: "Golden Latte",
        description: "Smooth espresso with steamed milk and a hint of honey.",
        category: "coffee",
        price: 4.25,
        imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d1f0f5e?w=600&h=600&fit=crop",
        isFeatured: true,
        ingredients: ["Espresso","Steamed milk","Honey"] as any
      }
    ]
  });
  console.log("Seeded sample menu items.");
}
run().finally(()=>prisma.$disconnect());
