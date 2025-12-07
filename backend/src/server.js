import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();

// ✅ Improved CORS setup — allows all your possible frontends
const allowedOrigins = [
  "http://localhost:5173",
  "https://talent-iq-frontend.onrender.com",
  "https://talent-iq-frontend-2lc7.onrender.com", // your current Render frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allows browser to send cookies/auth headers
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Clerk authentication middleware
app.use(clerkMiddleware());

// ✅ Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});
app.get("/", (req, res) => {
  res.status(200).json({ msg: "TalentIQ backend root — use /api endpoints" });
});

// ✅ Serve frontend in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // 🩵 FIXED: route pattern should be "*" (not "{*any}")
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server is running on port: ${ENV.PORT}`)
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
