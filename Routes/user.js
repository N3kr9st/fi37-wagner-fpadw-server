import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import 'dotenv/config';

const router = express.Router();

// Alle Nutzer abrufen
router.get('/user', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query('SELECT * FROM user');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Nutzer registrieren
 router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('POST /register aufgerufen', req.body);
  // Validierung (optional noch im Frontend)
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Bitte alle Felder ausfüllen' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Prüfen, ob der Nutzername oder die E-Mail bereits existieren
    const [existingUser] = await conn.query(
      'SELECT userID FROM user WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ message: 'Benutzername oder E-Mail bereits vergeben' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 1);

    // Einfügen
    await conn.query(
      'INSERT INTO user (username, email, passwort) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Registrieren' });
  } finally {
    if (conn) conn.release();
  }
});
 



router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
 
    const conn = await pool.getConnection();
    let user;
    try {
        [user] = await conn.query('SELECT * FROM user WHERE username = ?',[username]);
    } catch (error) {
        console.log(error);
    } finally {
        conn.release();
    }
    if (!user) return res.status(400).json(
        { error: 'Benutzer nicht gefunden' });
 
    const passwordMatch = await bcrypt.compare(password, user.passwort);
    if (!passwordMatch) return res.status(400).json(
        { error: 'Falsches Passwort' });
 
    const token = jwt.sign(
        { id: user.userID, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' });

    res.json({ token, userId: user.userID, username: user.username });
 

});



export default router;
