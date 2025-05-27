import express from 'express';
const router = express();

/**
* Route for home.
*
* @function
* @name Home
* @route {GET} /
* @returns {string} JSON string with hello world.
*/

router.get('/', (req, res) => {
    res.json({hello: 'world 13'});
});

export default router;