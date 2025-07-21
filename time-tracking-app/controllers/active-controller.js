// controllers/activityController.js

const { Client } = require('pg');
const { createId } = require('@paralleldrive/cuid2');
const { randomUUID } = require('crypto');

// Assuming you have your database client initialized here
const client = new Client({
  connectionString:
    'postgresql://bernard:zWfCh1O8vzhwZhuAk6oeCA@time-tracking-4223.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/development?sslmode=verify-full',
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

async function getActivity(req, res) {
  const { employeeId } = req.query;

  console.log('emloyeId', employeeId);
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  try {
    const result = await client.query(
      'SELECT * FROM "ActivityLog" WHERE "employeeId" = $1',
      [employeeId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching activity logs from database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createActivity(req, res) {
  const { mouseClicks, keyboardClicks, screenshots, employeeId, screenTime } =
    req.body;

  // Validate input data
  if (
    mouseClicks === undefined ||
    keyboardClicks === undefined ||
    employeeId === undefined ||
    screenTime === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if employee is connected to a company
    const companyQuery = `SELECT "companyId" FROM "Employee" WHERE "id" = $1`;
    const companyResult = await client.query(companyQuery, [employeeId]);

    if (!companyResult.rows.length || !companyResult.rows[0].companyId) {
      return res.status(403).json({
        error: 'You must be connected to a company to start tracking',
      });
    }

    const id = createId();
    const uuid = randomUUID();

    // Insert activity log with screenshot data
    const query = `
      INSERT INTO "ActivityLog" ("id", "uuid", "mouseClicks", "keyboardClicks", "screenshots", "employeeId", "screenTime")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      id,
      uuid,
      mouseClicks,
      keyboardClicks,
      screenshots, // Base64 image here
      employeeId,
      screenTime,
    ];

    const result = await client.query(query, values);
    const newActivityLog = result.rows[0];

    return res.status(200).json(newActivityLog); // Return newly created activity log
  } catch (error) {
    console.error('Error inserting activity log:', error);
    return res.status(500).json({ error: 'Error saving activity log' });
  }
}

async function updateActivity(req, res) {
  const { id } = req.params;
  const { mouseClicks, keyboardClicks, screenTime, screenshots } = req.body;

  // Validate input data
  if (
    mouseClicks === undefined ||
    keyboardClicks === undefined ||
    screenTime === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const query = `
      UPDATE "ActivityLog"
      SET "mouseClicks" = $1, "keyboardClicks" = $2, "screenshots" = $3, "screenTime" = $4  
      WHERE "id" = $5 AND DATE("createdAt") = $6
      RETURNING *;
    `;
    const values = [
      mouseClicks,
      keyboardClicks,
      screenshots,
      screenTime,
      id,
      today,
    ];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity log not found' });
    }

    const updatedActivityLog = result.rows[0]; // Get the updated activity log

    return res.status(200).json(updatedActivityLog); // Send back the updated activity log
  } catch (error) {
    console.error('Error updating activity log:', error);
    return res.status(500).json({ error: 'Error updating activity log' });
  }
}

module.exports = {
  getActivity,
  createActivity,
  updateActivity,
};
