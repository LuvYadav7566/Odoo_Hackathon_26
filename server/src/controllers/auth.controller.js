const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { createToken } = require("../utils/token");

const publicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  city: user.city,
  country: user.country,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  preferences: user.preferences,
  role: user.role
});

const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, city, country } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash, phone, city, country }
    });

    res.status(201).json({ user: publicUser(user), token: createToken(user.id) });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ user: publicUser(user), token: createToken(user.id) });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["firstName", "lastName", "phone", "city", "country", "bio", "avatarUrl", "preferences"];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, me, updateProfile };

