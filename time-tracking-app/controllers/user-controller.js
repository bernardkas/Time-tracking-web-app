const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://bernard:zWfCh1O8vzhwZhuAk6oeCA@time-tracking-4223.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/development?sslmode=verify-full',
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

async function getUser(req, res) {
  const { id } = req.user;

  try {
    // Query the database for the user
    const result = await client.query(
      'SELECT * FROM "User" WHERE id = $1', // Using id to find the user
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user from database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getUser,
};
