import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import Slip from "../models/Slip.js";
import { v2 as cloudinary } from "cloudinary";
import {
  analyzePrescription,
  generatePatientHealthReport,
} from "../services/aiService.js";

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

// AI Analysis endpoint for a single prescription
router.post("/:id/analyze", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const slip = await Slip.findOne({ _id: id, user: req.user.id });

    if (!slip) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Check if AI analysis already exists (optional: can re-analyze)
    if (slip.aiAnalysis && slip.aiAnalysis.analyzedAt) {
      return res.json({ slip, cached: true });
    }

    // Perform AI analysis
    const analysis = await analyzePrescription({
      title: slip.title,
      doctor: slip.doctor,
      hospital: slip.hospital,
      date: slip.date,
      notes: slip.notes,
      tags: slip.tags,
    });

    // Update slip with AI analysis
    slip.aiAnalysis = analysis;
    await slip.save();

    res.json({ slip, cached: false });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate comprehensive health report for the user
router.get("/health-report", requireAuth, async (req, res) => {
  try {
    const slips = await Slip.find({ user: req.user.id }).sort({ date: -1 });

    if (slips.length === 0) {
      return res.status(404).json({
        error: "No prescriptions found. Upload prescriptions first.",
      });
    }

    // Get user info
    const user = req.user;

    // Generate comprehensive health report
    const report = await generatePatientHealthReport(slips, user.name);

    res.json({
      report,
      patient: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Health report error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
