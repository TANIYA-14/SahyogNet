import pool from '../db.js';
import { askGemini } from '../gemini.js';

export const getMatches = async (req, res) => {
  try {
    const { need_id } = req.params;
    
    // 1. Fetch need
    const needResult = await pool.query('SELECT * FROM needs WHERE id = $1', [need_id]);
    if (needResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Need not found", status: 404 });
    }
    const need = needResult.rows[0];

    // 2. Fetch available volunteers
    const volsResult = await pool.query('SELECT * FROM volunteers WHERE is_available = true');
    const volunteers = volsResult.rows;

    if (volunteers.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Build prompt
    const prompt = `You are a volunteer matching engine for an NGO system called SahyogNet.

Community need:
- Zone: ${need.zone}
- Category: ${need.category}
- Description: ${need.description}
- Urgency level: ${need.urgency}/4

Available volunteers:
${volunteers.map(v => `ID:${v.id} | Name:${v.name} | Skills:${v.skills} | Zone:${v.zone}`).join('\n')}

Score each volunteer from 0 to 100 based on:
- Skill relevance to the need (most important)
- Zone proximity to the need zone
- Suitability for the urgency level

Return ONLY a valid JSON array with no explanation, no markdown, no code blocks. Just raw JSON:
[{"volunteer_id": 1, "score": 95, "reason": "short reason under 10 words"},
 {"volunteer_id": 2, "score": 87, "reason": "..."},
 {"volunteer_id": 3, "score": 72, "reason": "..."}]

Return exactly the top 3 volunteers sorted by score descending.`;

    let matchData;
    try {
      // 4. Call Gemini
      let geminiText = await askGemini(prompt);
      
      // Clean up the text just in case Gemini returns markdown blocks
      geminiText = geminiText.trim();
      if (geminiText.startsWith('\`\`\`json')) {
        geminiText = geminiText.slice(7, -3).trim();
      } else if (geminiText.startsWith('\`\`\`')) {
        geminiText = geminiText.slice(3, -3).trim();
      }

      matchData = JSON.parse(geminiText);
    } catch (geminiError) {
      console.error("Gemini matching failed, falling back to manual sort:", geminiError);
      
      // Fallback: Sort manually (same zone first)
      const sorted = [...volunteers].sort((a, b) => {
        const aZoneMatch = a.zone === need.zone ? 1 : 0;
        const bZoneMatch = b.zone === need.zone ? 1 : 0;
        return bZoneMatch - aZoneMatch; // descending
      }).slice(0, 3);
      
      matchData = sorted.map(v => ({
        volunteer_id: v.id,
        score: v.zone === need.zone ? 80 : 50,
        reason: "Fallback matched based on zone proximity"
      }));
    }

    // 5. Join with volunteer table
    const result = matchData.map(match => {
      const vol = volunteers.find(v => v.id === match.volunteer_id);
      return {
        volunteer: vol,
        score: match.score,
        reason: match.reason
      };
    }).filter(m => m.volunteer !== undefined);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting matches:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { need_id, volunteer_id, match_score } = req.body;
    
    if (!need_id || !volunteer_id) {
      return res.status(400).json({ error: true, message: "Missing required fields: need_id, volunteer_id" });
    }

    // Insert assignment
    const result = await pool.query(
      `INSERT INTO assignments (need_id, volunteer_id, match_score) VALUES ($1, $2, $3) RETURNING *`,
      [need_id, volunteer_id, match_score || null]
    );

    // Update need status to assigned
    await pool.query(
      `UPDATE needs SET status = 'assigned' WHERE id = $1`,
      [need_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};
