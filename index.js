import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import 'dotenv/config';

import testRouter from './Routes/test.js';
import userRouter from './Routes/user.js';
import favoritesRouter from './Routes/favorites.js';
import recipeRouter from './Routes/recipe.js';
import commentsRouter from './Routes/comments.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/default_Image', express.static(path.join(__dirname, 'default_Image')));

// CORS konfigurieren
app.use(cors({
    origin:'http://test.mshome.net:3000', 
    //origin: '*',
    credentials: true 
}));


app.listen(port, '0.0.0.0', () => {
  console.log("Server läuft auf Port 3001");
});

app.use('/',testRouter);
app.use('/',userRouter); 
app.use('/',favoritesRouter);
app.use('/',recipeRouter);
app.use('/',commentsRouter);