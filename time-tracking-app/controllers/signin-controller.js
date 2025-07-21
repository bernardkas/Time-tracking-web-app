// controllers/activityController.js

const { Client } = require('pg');
const { createId } = require('@paralleldrive/cuid2');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Assuming you have your database client initialized here
const client = new Client({
  connectionString:
    'postgresql://bernard:zWfCh1O8vzhwZhuAk6oeCA@time-tracking-4223.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/development?sslmode=verify-full',
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const result = await client.query(
    'SELECT * FROM "User" WHERE email = $1', // Using $1 as a placeholder
    [email] // Pass the actual email as an array of parameters
  );

  // Check if the user exists
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user?.role === 'COMPANY') {
    console.log('User from DB:', user?.role === 'COMPANY'); //
    return res
      .status(402)
      .json({ error: 'You need to register like Employee' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    '32131241231231223',
    {
      expiresIn: '1h',
    }
  );

  res.status(200).json({ token, user });
}

module.exports = {
  signIn,
};
