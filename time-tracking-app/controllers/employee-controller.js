const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://bernard:zWfCh1O8vzhwZhuAk6oeCA@time-tracking-4223.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/development?sslmode=verify-full',
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

async function getEmployee(req, res) {
  const { id } = req.user;

  try {
    const query = `
        SELECT 
          e.*,  -- Select all columns from Employee
          c.id AS company_id,
          c.name AS company_name
        FROM "Employee" e
        LEFT JOIN "Company" c ON e."companyId" = c.id
        WHERE e."userId" = $1
      `;

    const result = await client.query(query, [id]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee from database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller function to update the "isOnline" status of an employee
async function updateEmployee(req, res) {
  const { id } = req.params; // Employee ID from URL
  const { isOnline } = req.body; // "isOnline" value from request body

  if (typeof isOnline !== 'string') {
    return res.status(400).json({ error: 'Invalid isOnline value' });
  }

  try {
    const result = await client.query(
      'UPDATE "Employee" SET "isOnline" = $1 WHERE "id" = $2 RETURNING *',
      [isOnline, id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.log('Something went wrong!', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getEmployee, updateEmployee };
