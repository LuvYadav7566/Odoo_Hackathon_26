const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.sharedTrip.deleteMany();
  await prisma.note.deleteMany();
  await prisma.packingItem.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.create({
    data: {
      firstName: "Maya",
      lastName: "Kapoor",
      email: "maya@traveloop.app",
      passwordHash,
      city: "Ahmedabad",
      country: "India",
      role: "USER",
      preferences: { travelStyle: "culture + food", currency: "USD" }
    }
  });

  await prisma.user.create({
    data: {
      firstName: "Bhavesh",
      lastName: "Ganwani",
      email: "bg.bhavesh6@gmail.com",
      passwordHash,
      city: "Barwani",
      country: "India",
      role: "USER",
      preferences: { travelStyle: "custom planner", currency: "INR" }
    }
  });

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "Traveloop",
      email: "admin@traveloop.app",
      passwordHash,
      city: "Ahmedabad",
      country: "India",
      role: "ADMIN",
      preferences: { dashboard: "analytics", currency: "INR" }
    }
  });

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "Japan Spring Loop",
      slug: "japan-spring-loop",
      startingPlace: "Ahmedabad",
      destinationPlace: "Japan",
      description: "A city-hopping route through Tokyo, Kyoto and Osaka.",
      coverImage: "https://images.unsplash.com/photo-1528164344705-47542687000d",
      startDate: new Date("2026-04-04"),
      endDate: new Date("2026-04-15"),
      status: "PLANNING",
      isPublic: true,
      budget: { create: { total: 265000, hotels: 92000, transport: 58000, food: 54000, activities: 38000, currency: "INR" } },
      stops: {
        create: [
          {
            city: "Tokyo",
            country: "Japan",
            arrivalDate: new Date("2026-04-04"),
            departDate: new Date("2026-04-08"),
            order: 1
          },
          {
            city: "Kyoto",
            country: "Japan",
            arrivalDate: new Date("2026-04-08"),
            departDate: new Date("2026-04-12"),
            order: 2
          }
        ]
      },
      activities: {
        create: [
          { title: "Shibuya night walk", category: "SIGHTSEEING", dayNumber: 1, cost: 0, duration: 120 },
          { title: "Tsukiji breakfast trail", category: "FOOD", dayNumber: 2, cost: 3500, duration: 150 },
          { title: "Fushimi Inari sunrise", category: "CULTURE", dayNumber: 5, cost: 0, duration: 180 },
          { title: "Tea ceremony", category: "CULTURE", dayNumber: 6, cost: 4600, duration: 90 }
        ]
      },
      packingItems: {
        create: [
          { name: "Passport", category: "DOCUMENTS" },
          { name: "Universal adapter", category: "ELECTRONICS" },
          { name: "Light jacket", category: "CLOTHING" }
        ]
      },
      notes: {
        create: [
          { title: "JR Pass", content: "Activate rail pass at Tokyo Station after arrival." },
          { title: "Food list", content: "Try okonomiyaki in Osaka and matcha desserts in Kyoto." }
        ]
      }
    }
  });

  await prisma.sharedTrip.create({
    data: { userId: user.id, tripId: trip.id, publicId: "japan-spring-loop-public", canCopy: true, views: 128 }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
