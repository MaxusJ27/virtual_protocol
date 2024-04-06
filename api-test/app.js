// initialize the database connection
var { Pool } = require('pg');

const pool = new Pool({
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: '',
  password: process.env.RDS_PASSWORD,
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false
  },
});


// express
const express = require('express');
// cors
const cors = require('cors');
// app 
const app = express();
// router
const router = express.Router()

const port = process.env.PORT || 8000;

// Enable JSON body parsing
app.use(express.json());
// Enable CORS middleware
router.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API endpoint to get recommendations (SELECT)
router.get('/api/users', async (req, res) => {

  try {
    const client = await pool.connect();



    const queryResult = await client.query(`
        SELECT 
          *
        FROM
          users;
        `);
    client.release();

    res.status(200).json(queryResult);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update user status 
router.post('/api/users/:id', async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { status } = req.body; // Get the new status from the request body

  try {
    const client = await pool.connect();

    // Construct the SQL query to update user status
    const queryText = 'UPDATE users SET status = $1 WHERE id = $2';
    // Execute the query
    const result = await client.query(queryText, [status, id]);
    client.release();

    // Return success response
    res.status(200).json({ message: `User status updated successfully for ID ${id}` });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to retrieve the liked and disliked users 
router.get('/api/users/status', async (req, res) => {
  try {
    const client = await pool.connect();

    // Construct the SQL query to get liked and disliked users
    const queryResult = await client.query(`
        SELECT 
          *
        FROM
          users
        WHERE
          status IN ('liked', 'disliked');
          `);
    client.release();
    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error fetching liked and disliked users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get recommendations
router.get('/api/recommendations', async (req, res) => {
  try {
    const client = await pool.connect();

    const queryResult = await client.query(`
        SELECT 
          id, 
          name, 
          gender, 
          location, 
          university, 
          interests,
          status,
          (
              CASE 
                  WHEN gender = 'Female' THEN 2
                  ELSE 1
              END
          ) AS gender_weightage,
          (
              CASE 
                  WHEN location = 'User_Location' THEN 3
                  ELSE 1
              END
          ) AS location_weightage,
          (
              CASE 
                  WHEN university = 'User_University' THEN 2
                  ELSE 1
              END
          ) AS university_weightage,
          (
              CASE 
                  WHEN 'User_Interest' IN (SELECT unnest(interests)) THEN 2
                  ELSE 1
              END
          ) AS interest_weightage,
          RANDOM() AS random_score
        FROM 
          users
        ORDER BY 
          gender_weightage DESC,
          location_weightage DESC,
          university_weightage DESC,
          interest_weightage DESC,
          random_score
        LIMIT 10;
      `);

    client.release();

    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/', router);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;
// module.exports.handler = serverless(app);