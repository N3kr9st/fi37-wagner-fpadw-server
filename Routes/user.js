
import express from 'express';
import bcrypt from  'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import 'dotenv/config';


const router = express.Router();


router.get('/user', async (req, res) => {

    let conn;
    let user;

    try {
        conn = await pool.getConnection();
        user = await conn.query('SELECT * FROM user');
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Database error'});
    } finally {
        conn.release();
    }
})



export default router;