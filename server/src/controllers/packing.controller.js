const prisma = require("../config/prisma");

const listPacking = async (req, res, next) => {
  try {
    const items = await prisma.packingItem.findMany({
      where: { tripId: req.params.tripId, trip: { userId: req.user.id } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const createPacking = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const item = await prisma.packingItem.create({ data: req.body });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

const updatePacking = async (req, res, next) => {
  try {
    const item = await prisma.packingItem.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!item || item.trip.userId !== req.user.id) return res.status(404).json({ message: "Packing item not found" });
    const updated = await prisma.packingItem.update({ where: { id: req.params.id }, data: req.body });
    res.json({ item: updated });
  } catch (error) {
    next(error);
  }
};

const deletePacking = async (req, res, next) => {
  try {
    const item = await prisma.packingItem.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!item || item.trip.userId !== req.user.id) return res.status(404).json({ message: "Packing item not found" });
    await prisma.packingItem.delete({ where: { id: req.params.id } });
    res.json({ message: "Packing item deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listPacking, createPacking, updatePacking, deletePacking };

