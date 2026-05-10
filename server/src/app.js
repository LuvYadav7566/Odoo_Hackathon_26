require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const tripRoutes = require("./routes/trip.routes");
const stopRoutes = require("./routes/stop.routes");
const activityRoutes = require("./routes/activity.routes");
const budgetRoutes = require("./routes/budget.routes");
const packingRoutes = require("./routes/packing.routes");
const noteRoutes = require("./routes/note.routes");
const shareRoutes = require("./routes/share.routes");
const cityRoutes = require("./routes/city.routes");
const adminRoutes = require("./routes/admin.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "traveloop-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/packing", packingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/shared", shareRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
