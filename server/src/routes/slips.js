import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import Slip from "../models/Slip.js";
import { v2 as cloudinary } from "cloudinary";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", requireAuth, async (req, res) => {
  const { q } = req.query;
  let filter = { user: req.user.id };
  if (q) {
    filter.$text = { $search: q };
  }
  const slips = await Slip.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .limit(100);
  res.json(slips);
});

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File required" });
  const { title, doctor, hospital, date, tags, notes } = req.body;
  let uploadResult = {};
  if (process.env.CLOUDINARY_URL) {
    uploadResult = await cloudinary.uploader.upload_stream;
  }
  // For now, we will just simulate and store as base64 (NOT for production)
  const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    "base64"
  )}`;
  const slip = await Slip.create({
    user: req.user.id,
    title: title || req.file.originalname,
    doctor,
    hospital,
    date: date ? new Date(date) : new Date(),
    tags: tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    notes,
    fileUrl: b64,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
  res.status(201).json(slip);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const slip = await Slip.findOne({ _id: id, user: req.user.id });
  if (!slip) return res.status(404).json({ error: "Not found" });
  await slip.deleteOne();
  res.json({ success: true });
});

export default router;
