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

router.post('/addComment', async (req, res) => {

    const commentText  = req.body.comment;
    const recipeID = req.body.recipeID || "1"; 
    const userID = req.body.userID || "1"; 
    


    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO comments (recipeID, userID, commentText) VALUES (?, ?, ?)', [recipeID, userID, commentText]);
        res.status(201).json({ message: 'Kommentar erfolgreich hinzugefügt' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});



export default router;