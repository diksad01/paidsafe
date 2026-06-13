import "../config/env.js";
import express from "express";
import { db } from "../services/firebase.js";
import authMiddleware from "../middleware/auth.js";
import axios from "axios";

const router = express.Router();



router.post("/draft", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        error: "Job description is required"
      });
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      return res.status(400).json({
        error: "Please provide a more detailed job description"
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:"meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content:
              "You are a contract generator for freelancers. Always return ONLY valid JSON with this structure: { milestones: [{ title: string, amount: number }], totalAmount: number, currency: string }. Do not include any explanation text."
          },
          {
            role: "user",
            content: trimmedDescription
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: aiText
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate contract with AI"
    });
  }
});
/* POST /api/contracts/create
  */
  router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      clientEmail,
      milestones,
      totalAmount
    } = req.body;

    const contractRef = await db.collection("contracts").add({
      title,
      clientEmail,
      totalAmount,
      freelancerId: req.user.uid,
      status: "PENDING_CLIENT",
      createdAt: new Date()
    });

    if (milestones && milestones.length > 0) {
      for (const milestone of milestones) {
        await contractRef.collection("milestones").add({
          title: milestone.title,
          amount: milestone.amount,
          status: "PENDING",
          createdAt: new Date()
        });
      }
    }

    res.status(201).json({
      contractId: contractRef.id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create contract"
    });
  }
});



 router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const snapshot = await db
      .collection("contracts")
      .where("freelancerId", "==", uid)
      .get();

    const contracts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      contracts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch contracts"
    });
  }
});


/*GET /api/contracts/:id*/
  
  router.get("/:id", async (req, res) => {
  try {
    const contractId = req.params.id;

    const contractDoc = await db
      .collection("contracts")
      .doc(contractId)
      .get();

    if (!contractDoc.exists) {
      return res.status(404).json({
        error: "Contract not found"
      });
    }

    const milestonesSnapshot = await db
      .collection("contracts")
      .doc(contractId)
      .collection("milestones")
      .get();

    const milestones = milestonesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      id: contractDoc.id,
      ...contractDoc.data(),
      milestones
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch contract"
    });
  }
});
  

export default router;
