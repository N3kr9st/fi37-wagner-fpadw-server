
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

router.post('/addRecipe', async (req, res) => {
    const { name, preparation, ingredients } = req.body;
    const userID = req.body.userID || "1"; 
    console.log("userID:", req.body.userID);

    if (!name || !preparation || !ingredients) {
        return res.status(400).json({ error: 'Alle Felder werden benötigt' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO recipe (userID,recipeTitle, zubereitung, zutaten) VALUES (?, ?, ?, ?)', [userID,name, preparation, ingredients]);
        res.status(201).json({ message: 'Rezept erfolgreich hinzugefügt' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (conn) conn.release();
    }
});


export default router;