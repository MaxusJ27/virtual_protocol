// get user data
const { users } = require('../src/lib/dummy-data');

// database
const { db } = require('@vercel/postgres');

// pool
const { Pool } = require('pg');

// create user table and insert dummy data
const createUsers = async (pool) => {
    const client = await pool.connect();
    try {
        // Create extension if not exists
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Drop all existing tables
        await client.query('DROP TABLE IF EXISTS customers, invoices, revenue, files, embeddings, models, users, models, likes, dislikes, matches');
        console.log('Dropped tables');

        // Create users table
        await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
        location VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        interests TEXT[] NOT NULL,
        status VARCHAR(10) NOT NULL CHECK (status IN ('liked', 'disliked', 'matched', 'unmatched'))
      )
    `);
        console.log('Created table "users"');

        // Insert dummy data
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                return client.query(`
            INSERT INTO users (name, gender, location, university, interests, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `, [user.name, user.gender, user.location, user.university, user.interests, user.status]);
            })
        );
        console.log(`Seeded ${insertedUsers.length} users`);

        return {
            createTable: 'Success',
            users: insertedUsers,
        };
    } catch (error) {
        console.error('Error dropping tables', error);
        throw error;
    } finally {
        client.release();
    }
};


async function main() {
    // Connect to database
    // const client = await pool.connect();
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

    // Drop tables before seeding
    await createUsers(pool);



    await pool.end();

}

main().catch((error) => {
    console.error('Error seeding database', error);
});



