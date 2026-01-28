const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");
const instruction = require("./Instruction");

const router = express.Router();

/* ================== MULTER ================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/* ================== GEMINI CLIENT ================== */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* ================== ROUTE ================== */
router.post("/image-summary", upload.single("image"), async (req, res) => {
  try {
    /* 1️⃣ Validate image */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    /* 2️⃣ Convert image to base64 */
    const base64Image = req.file.buffer.toString("base64");

    /* 3️⃣ Gemini API call */
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
      systemInstruction: instruction,
    });

    /* 4️⃣ Extract text safely */
    const summary =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    /* 5️⃣ Send response */
    return res.status(200).json({
      success: true,
      summary,
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process image",
    });
  }
});

module.exports = router;
