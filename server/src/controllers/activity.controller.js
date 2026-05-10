const prisma = require("../config/prisma");

const samples = [
  { title: "Old Town walking tour", category: "CULTURE", duration: 180, cost: 3000 },
  { title: "Street food tasting", category: "FOOD", duration: 120, cost: 2200 },
  { title: "Sunset viewpoint", category: "SIGHTSEEING", duration: 90, cost: 0 },
  { title: "Kayak adventure", category: "ADVENTURE", duration: 150, cost: 5500 },
  { title: "Local market visit", category: "SHOPPING", duration: 80, cost: 1200 }
];

const searchActivities = (req, res) => {
  const { category, budget } = req.query;
  const max = budget ? Number(budget) : Number.MAX_SAFE_INTEGER;
  const activities = samples.filter((item) => (!category || item.category === category) && item.cost <= max);
  res.json({ activities });
};

const createActivity = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const activity = await prisma.activity.create({
      data: {
        tripId: req.body.tripId,
        stopId: req.body.stopId || null,
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        dayNumber: req.body.dayNumber ? Number(req.body.dayNumber) : undefined,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
        duration: req.body.duration,
        cost: req.body.cost || 0,
        location: req.body.location
      }
    });
    res.status(201).json({ activity });
  } catch (error) {
    next(error);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const activity = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { trip: true, stop: { include: { trip: true } } } });
    const ownerId = activity?.trip?.userId || activity?.stop?.trip?.userId;
    if (!activity || ownerId !== req.user.id) return res.status(404).json({ message: "Activity not found" });
    const updated = await prisma.activity.update({ where: { id: req.params.id }, data: req.body });
    res.json({ activity: updated });
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const activity = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { trip: true, stop: { include: { trip: true } } } });
    const ownerId = activity?.trip?.userId || activity?.stop?.trip?.userId;
    if (!activity || ownerId !== req.user.id) return res.status(404).json({ message: "Activity not found" });
    await prisma.activity.delete({ where: { id: req.params.id } });
    res.json({ message: "Activity deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchActivities, createActivity, updateActivity, deleteActivity };
