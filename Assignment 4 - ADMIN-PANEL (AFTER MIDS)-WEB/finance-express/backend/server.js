// backend/server.js
console.log("🚀 Server file loaded");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();
const PORT = 3001;

/* =========================
   View engine (EJS)
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

/* =========================
   Middleware
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* =========================
   Static (Public)
========================= */
app.use(express.static(path.join(__dirname, "../public")));

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
  })
);

/* =========================
   Admin Panel (React build)
   ✅ MUST BE BEFORE app.use("/")
========================= */
const adminPanelPath = path.join(__dirname, "../admin-panel/dist");
app.use("/admin", express.static(adminPanelPath));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPanelPath, "index.html"));
});

/* =========================
   API / Page Routes
========================= */
const productAPIRoutes = require("./routes/products");
const productPageRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");

app.use("/test-products", productAPIRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProductRoutes);
// ✅ Put website routes AFTER /admin so they don't steal /admin
app.use("/", productPageRoutes);

/* =========================
   404
========================= */
app.use((req, res) => res.status(404).send("❌ Page not found"));

/* =========================
   Start server
========================= */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`🔐 Admin Panel: http://localhost:${PORT}/admin`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
