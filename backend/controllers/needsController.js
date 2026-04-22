import pool from '../db.js';

// POST /api/needs
export const createNeed = async (req, res) => {
  try {
    const { zone, category, description, urgency, lat, lng } = req.body;
    
    if (!zone || !category || !description || !urgency) {
      return res.status(400).json({ error: true, message: "Missing required fields: zone, category, description, urgency" });
    }

    const result = await pool.query(
      `INSERT INTO needs (zone, category, description, urgency, lat, lng) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [zone, category, description, urgency, lat || null, lng || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating need:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};

// GET /api/needs
export const getNeeds = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM needs ORDER BY urgency DESC, created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting needs:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};

// GET /api/needs/:id
export const getNeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM needs WHERE id = $1`, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Need not found", status: 404 });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error getting need by ID:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};

// PATCH /api/needs/:id/status
export const updateNeedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: true, message: "Missing required field: status" });
    }

    const result = await pool.query(
      `UPDATE needs SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Need not found", status: 404 });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating need status:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};
