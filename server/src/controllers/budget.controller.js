const prisma = require("../config/prisma");

const getBudget = async (req, res, next) => {
  try {
    const budget = await prisma.budget.findFirst({ where: { tripId: req.params.tripId, trip: { userId: req.user.id } } });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ budget });
  } catch (error) {
    next(error);
  }
};

const upsertBudget = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const data = {
      total: req.body.total || 0,
      hotels: req.body.hotels || 0,
      transport: req.body.transport || 0,
      food: req.body.food || 0,
      activities: req.body.activities || 0,
      currency: req.body.currency || "USD"
    };
    const budget = await prisma.budget.upsert({
      where: { tripId: req.params.tripId },
      create: { tripId: req.params.tripId, ...data },
      update: data
    });
    res.json({ budget });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudget, upsertBudget };

