import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors"
import { functions } from "./lib/inngest.js";
import {inngest} from "./lib/inngest.js"
import { serve } from "inngest/express";

import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(clerkMiddleware())   //this adds auth fied to request object req.auth()

app.use("/api/inngest",serve({client:inngest,functions}))
app.use("api/chat",chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  
  res.status(200).json({ msg: "API IS UP AND RUNNING" });
});




// Serve frontend only in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Express 5 compatible wildcard route
  
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Connect to DB first, then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`✅ Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
