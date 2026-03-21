import express from "express";

const router = express.Router();

const SYSTEM_PROMPT = `You are CyberLens AI, an expert cybersecurity assistant integrated into the CyberLens vulnerability assessment platform.

You help users with:
1. Explaining vulnerabilities found in scans (Nuclei, Nikto, Nmap, WhatWeb, Subfinder, SSLyze)
2. Providing remediation steps and fixes
3. Answering general cybersecurity questions
4. Analyzing scan results and risk scores
5. Explaining CVE IDs, CVSS scores, and severity levels

Guidelines:
- Be concise but thorough
- Always provide actionable remediation steps when discussing vulnerabilities
- Explain technical terms in simple language
- When discussing CVEs, mention the severity and impact
- Keep responses focused on cybersecurity topics
- Format responses clearly with sections when needed`;

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      console.error("Groq error:", data.error);
      return res.status(500).json({ message: data.error.message });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not process that. Please try again.";

    res.json({ reply });
  } catch (error) {
    console.error("AI route error:", error);
    res.status(500).json({ message: "AI service error" });
  }
});

export default router;
