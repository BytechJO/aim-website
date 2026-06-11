import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./src/DB/initDB";
import { seedSuperAdmin } from "./src/DB/seedSuperAdmin";
import { initSocket } from "./src/socket";
import authRoutes from "./src/routes/auth.routes";
import adminRoutes from "./src/routes/admins.routes";
import productRoutes from "./src/routes/products.routes";
import reviewRoutes from "./src/routes/reviews.routes";
import instagramRoutes from "./src/routes/instagram.routes";
import contactRoutes from "./src/routes/contact.routes";
import newsletterRoutes from "./src/routes/newsletter.routes";
import uploadRoutes from "./src/routes/upload.routes";
import analyticsRoutes from "./src/routes/analytics.routes";
import enhancementRoutes from "./src/routes/enhancement/enhancement.routes";
import enhancementTypesRoutes from "./src/routes/enhancement/enhancement-types.routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/enhancements", enhancementRoutes);
app.use("/api/enhancement-types", enhancementTypesRoutes);
initDB()
  .then(() => seedSuperAdmin())
  .then(() => {
    initSocket(server);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
