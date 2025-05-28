import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import testRouter from './Routes/test.js';
import userRouter from './Routes/user.js';
import favoritesRouter from './Routes/favorites.js';
import recipeRouter from './Routes/recipe.js';
import commentsRouter from './Routes/comments.js';

 
const app = express();
const port = 3001
app.use(express.json())
 
// CORS konfigurieren
app.use(cors({
    origin:'http://test.mshome.net:3000', 
    //origin: '*',
    credentials: true 
}));


app.listen(port, () =>{
    console.log(`Server läuft auf http://api-test.mshome.net:${port}`);
});

app.use('/',testRouter);
app.use('/',userRouter); 
app.use('/',favoritesRouter);
app.use('/',recipeRouter);
app.use('/',commentsRouter);