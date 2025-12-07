import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId; // ✅ no () — it's a property, not a function

      if (!clerkId)
        return res.status(401).json({ message: "Unauthorized - invalid token" });

      // Find existing user or create if missing
      let user = await User.findOne({ clerkId });

      if (!user) {
        user = await User.create({
          clerkId,
          name: req.auth.sessionClaims.full_name || "New User",
          email: req.auth.sessionClaims.email || "unknown@example.com",
          profileImage:
            req.auth.sessionClaims.image_url ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
        console.log("🆕 Created new user:", user.name);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
