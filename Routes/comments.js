import express from 'express';
import pool from '../db.js';
import 'dotenv/config';


const router = express.Router();


router.get('/comments', async (req, res) => {

    let conn;
    let comments;

    try {
        conn = await pool.getConnection();
        comments = await conn.query('SELECT * FROM comments');
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Database error'});
    } finally {
        conn.release();
    }
})



export default router;