
import express from 'express';
import pool from '../db.js';
import 'dotenv/config';


const router = express.Router();


router.get('/favorites', async (req, res) => {

    let conn;
    let favorites;

    try {
        conn = await pool.getConnection();
        favorites = await conn.query('SELECT * FROM favorites');
        res.json(favorites);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Database error'});
    } finally {
        conn.release();
    }
})



export default router;