import express from 'express';
import pool from '../db.js';
import 'dotenv/config';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Verzeichnis 'uploads' erstellen, falls es nicht existiert
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer-Setup: speichert Bild in /uploads mit Originalname + Zeitstempel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Nur Bilddateien erlaubt'), false);
    }
    cb(null, true);
  },
});

router.get('/recipe', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const recipe = await conn.query('SELECT * FROM recipe');
    res.json(recipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

router.delete('/deleteRecipe/:recipeID', async (req, res) => {
  const recipeID = req.params.recipeID;
  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query('DELETE FROM recipe WHERE recipeID = ?', [recipeID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rezept nicht gefunden' });
    }

    res.status(200).json({ message: 'Rezept erfolgreich gelöscht' });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ error: 'Datenbankfehler beim Löschen' });
  } finally {
    if (conn) conn.release();
  }
});

router.get('/userRecipe', async (req, res) => {
  let conn;
  console.log("UserID:", req.query.userID);
  try {
    conn = await pool.getConnection();
    const recipe = await conn.query('SELECT * FROM recipe where userID = ?', [req.query.userID]);
    if (recipe.length === 0) {
      return res.status(404).json({ error: 'Keine Rezepte gefunden' });
    } 
    return res.status(200).json(recipe);    
  
  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

router.post('/addRecipe', upload.single('image'), async (req, res) => {
  const { name, preparation, ingredients } = req.body;
  const userID = req.body.userID ;
  console.log("UserID:", userID);
  if (!name || !preparation || !ingredients) {
    return res.status(400).json({ error: 'Alle Felder werden benötigt' });
  }

  const imagePath = req.file ? req.file.path : null;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO recipe (userID, recipeTitle, zubereitung, zutaten, imagePath) VALUES (?, ?, ?, ?, ?)',
      [userID, name, preparation, ingredients, imagePath]
    );
    res.status(201).json({ message: 'Rezept erfolgreich hinzugefügt' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

export default router;