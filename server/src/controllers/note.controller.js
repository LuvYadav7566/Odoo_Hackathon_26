const prisma = require("../config/prisma");

const listNotes = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { tripId: req.params.tripId, trip: { userId: req.user.id } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ notes });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const note = await prisma.note.create({
      data: { ...req.body, day: req.body.day ? new Date(req.body.day) : undefined }
    });
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!note || note.trip.userId !== req.user.id) return res.status(404).json({ message: "Note not found" });
    const updated = await prisma.note.update({ where: { id: req.params.id }, data: req.body });
    res.json({ note: updated });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!note || note.trip.userId !== req.user.id) return res.status(404).json({ message: "Note not found" });
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ message: "Note deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listNotes, createNote, updateNote, deleteNote };

