const slugify = require("slugify");
const prisma = require("../config/prisma");

const defaultCoverImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const tripInclude = {
  stops: { include: { activities: true }, orderBy: { order: "asc" } },
  activities: { orderBy: [{ dayNumber: "asc" }, { createdAt: "asc" }] },
  budget: true,
  packingItems: true,
  notes: { orderBy: { createdAt: "desc" } },
  sharedTrips: true
};

const listTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: { stops: true, activities: true, budget: true, sharedTrips: true },
      orderBy: { updatedAt: "desc" }
    });
    res.json({ trips });
  } catch (error) {
    next(error);
  }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: tripInclude
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const { title, startingPlace, destinationPlace, description, coverImage, startDate, endDate, status } = req.body;
    if (!title || !startingPlace || !destinationPlace || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, starting place, destination place, start date and end date are required" });
    }

    const slug = `${slugify(title, { lower: true, strict: true })}-${Date.now()}`;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title,
        slug,
        startingPlace,
        destinationPlace,
        description,
        coverImage: coverImage || defaultCoverImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        budget: { create: { total: 0, currency: "INR" } }
      },
      include: tripInclude
    });

    res.status(201).json({ trip });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: "Trip not found" });

    const { title, startingPlace, destinationPlace, description, coverImage, startDate, endDate, status, isPublic } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
        title,
        startingPlace,
        destinationPlace,
        description,
        coverImage,
        status,
        isPublic,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      },
      include: tripInclude
    });

    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: "Trip not found" });
    await prisma.trip.delete({ where: { id: req.params.id } });
    res.json({ message: "Trip deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listTrips, getTrip, createTrip, updateTrip, deleteTrip, tripInclude };
