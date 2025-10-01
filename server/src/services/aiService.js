import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a single prescription/medical report
 */
export async function analyzePrescription(prescriptionData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a medical AI assistant analyzing a prescription/medical report. 

Prescription Details:
- Title: ${prescriptionData.title}
- Doctor: ${prescriptionData.doctor || "Not specified"}
- Hospital: ${prescriptionData.hospital || "Not specified"}
- Date: ${prescriptionData.date || "Not specified"}
- Notes: ${prescriptionData.notes || "None"}
- Tags: ${prescriptionData.tags?.join(", ") || "None"}

Please provide a detailed analysis in the following JSON format:
{
  "summary": "Brief 2-3 sentence summary of the prescription",
  "healthIssues": ["List of identified health issues or conditions"],
  "causes": ["Possible causes for these conditions"],
  "precautions": ["Important precautions to take"],
  "remedies": ["Suggested remedies or lifestyle changes"],
  "recommendations": ["General health recommendations"]
}

Important: Return ONLY valid JSON, no markdown, no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(cleanedText);
    return {
      ...analysis,
      analyzedAt: new Date(),
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze prescription: " + error.message);
  }
}

/**
 * Generate a comprehensive health report for a patient based on all prescriptions
 */
export async function generatePatientHealthReport(prescriptions, patientName) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare prescription summary
    const prescriptionSummary = prescriptions
      .map(
        (p, idx) => `
${idx + 1}. ${p.title}
   - Doctor: ${p.doctor || "N/A"}
   - Date: ${p.date ? new Date(p.date).toLocaleDateString() : "N/A"}
   - Notes: ${p.notes || "None"}
   - Tags: ${p.tags?.join(", ") || "None"}
`
      )
      .join("\n");

    const prompt = `
You are a medical AI assistant generating a comprehensive health report for a patient.

Patient Name: ${patientName}
Total Prescriptions: ${prescriptions.length}

Prescription History:
${prescriptionSummary}

Please provide a comprehensive health analysis in the following JSON format:
{
  "overallHealthStatus": "Brief assessment of overall health status",
  "commonConditions": ["List of recurring or common health conditions"],
  "riskFactors": ["Identified risk factors"],
  "healthTrends": "Analysis of health trends over time",
  "criticalRecommendations": ["Most important health recommendations"],
  "lifestyleAdvice": ["Lifestyle modifications suggested"],
  "followUpNeeded": ["Areas requiring medical follow-up"],
  "positiveIndicators": ["Positive health indicators"],
  "summary": "2-3 paragraph comprehensive summary"
}

Important: Return ONLY valid JSON, no markdown, no extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const report = JSON.parse(cleanedText);
    return {
      ...report,
      generatedAt: new Date(),
      prescriptionCount: prescriptions.length,
    };
  } catch (error) {
    console.error("Health Report Generation Error:", error);
    throw new Error("Failed to generate health report: " + error.message);
  }
}
