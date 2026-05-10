const prisma = require("../config/prisma");
const { destinations } = require("./city.controller");

const getAnalytics = async (req, res, next) => {
  try {
    const [users, trips, activities, sharedTrips] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.activity.count(),
      prisma.sharedTrip.count()
    ]);

    const status = await prisma.trip.groupBy({ by: ["status"], _count: { status: true } });
    const popularDestinations = destinations.slice(0, 5).map((item) => ({
      name: `${item.city}, ${item.country}`,
      popularity: item.popularity
    }));

    res.json({
      totals: { users, trips, activities, sharedTrips },
      tripStatus: status.map((item) => ({ status: item.status, count: item._count.status })),
      popularDestinations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
