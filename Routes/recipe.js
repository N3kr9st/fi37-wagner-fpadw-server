
import express from 'express';
import pool from '../db.js';
import 'dotenv/config';


const router = express.Router();


router.get('/recipe', async (req, res) => {

    let conn;
    let recipe;

    try {
        conn = await pool.getConnection();
        recipe = await conn.query('SELECT * FROM recipe');
        res.json(recipe);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Database error'});
    } finally {
        conn.release();
    }
})



export default router;