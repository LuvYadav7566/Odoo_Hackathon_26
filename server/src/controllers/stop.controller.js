const prisma = require("../config/prisma");

const ensureTrip = async (tripId, userId) => {
  return prisma.trip.findFirst({ where: { id: tripId, userId } });
};

const createStop = async (req, res, next) => {
  try {
    const { tripId, city, country, arrivalDate, departDate, order, notes } = req.body;
    const trip = await ensureTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const stop = await prisma.stop.create({
      data: { tripId, city, country, arrivalDate: new Date(arrivalDate), departDate: new Date(departDate), order, notes },
      include: { activities: true }
    });
    res.status(201).json({ stop });
  } catch (error) {
    next(error);
  }
};

const updateStop = async (req, res, next) => {
  try {
    const stop = await prisma.stop.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) return res.status(404).json({ message: "Stop not found" });

    const { city, country, arrivalDate, departDate, order, notes } = req.body;
    const updated = await prisma.stop.update({
      where: { id: req.params.id },
      data: {
        city,
        country,
        order,
        notes,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : undefined,
        departDate: departDate ? new Date(departDate) : undefined
      },
      include: { activities: true }
    });
    res.json({ stop: updated });
  } catch (error) {
    next(error);
  }
};

const deleteStop = async (req, res, next) => {
  try {
    const stop = await prisma.stop.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) return res.status(404).json({ message: "Stop not found" });
    await prisma.stop.delete({ where: { id: req.params.id } });
    res.json({ message: "Stop deleted" });
  } catch (error) {
    next(error);
  }
};

const reorderStops = async (req, res, next) => {
  try {
    const { tripId, stopIds } = req.body;
    const trip = await ensureTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    await prisma.$transaction(stopIds.map((id, index) => prisma.stop.update({ where: { id }, data: { order: index + 1 } })));
    const stops = await prisma.stop.findMany({ where: { tripId }, include: { activities: true }, orderBy: { order: "asc" } });
    res.json({ stops });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStop, updateStop, deleteStop, reorderStops };

