import pool from '../db.js';

// GET /api/volunteers
export const getVolunteers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM volunteers ORDER BY id ASC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting volunteers:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};

// POST /api/volunteers
export const createVolunteer = async (req, res) => {
  try {
    const { name, skills, zone, lat, lng, phone } = req.body;
    
    if (!name || !skills) {
      return res.status(400).json({ error: true, message: "Missing required fields: name, skills" });
    }

    const result = await pool.query(
      `INSERT INTO volunteers (name, skills, zone, lat, lng, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, skills, zone || null, lat || null, lng || null, phone || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating volunteer:", error);
    res.status(500).json({ error: true, message: "Internal Server Error", status: 500 });
  }
};
