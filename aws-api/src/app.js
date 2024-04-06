const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const { getCurrentInvoke } = require('@codegenie/serverless-express')
var { Pool } = require('pg');

const pool = new Pool({
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: '',
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false
  },
});
const ejs = require('ejs').__express
const app = express()
const router = express.Router()

app.set('view engine', 'ejs')
app.engine('.ejs', ejs)

router.use(compression())

router.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))

router.get('/', (req, res) => {
  const currentInvoke = getCurrentInvoke()
  const { event = {} } = currentInvoke
  const {
    requestContext = {},
    multiValueHeaders = {}
  } = event
  const { stage = 'Stage' } = requestContext
  const {
    Host = ['localhost:3000']
  } = multiValueHeaders
  const apiUrl = `https://${Host[0]}/${stage}`
  res.render('index', {
    apiUrl,
    stage
  })
})

// API endpoint to get all users
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

    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
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



router.get('/cookie', (req, res) => {
  res.cookie('Foo', 'bar')
  res.cookie('Fizz', 'buzz')
  res.json({})
})


// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
