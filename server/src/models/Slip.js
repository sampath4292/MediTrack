import mongoose from "mongoose";

const slipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    doctor: { type: String },
    hospital: { type: String },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    notes: { type: String },
    aiAnalysis: {
      summary: { type: String },
      healthIssues: [{ type: String }],
      causes: [{ type: String }],
      precautions: [{ type: String }],
      remedies: [{ type: String }],
      recommendations: [{ type: String }],
      analyzedAt: { type: Date },
    },
  },
  { timestamps: true }
);

slipSchema.index({
  title: "text",
  doctor: "text",
  hospital: "text",
  tags: "text",
  notes: "text",
});

export default mongoose.model("Slip", slipSchema);
