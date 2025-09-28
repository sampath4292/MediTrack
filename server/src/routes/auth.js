import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({ error: "Validation failed", details: errors.array() });
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists)
        return res
          .status(409)
          .json({ error: "Email already registered", field: "email" });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "7d" }
      );
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("/register error", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({ error: "Validation failed", details: errors.array() });
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "7d" }
      );
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("/login error", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
