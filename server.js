const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.set('unsplash_key', process.env.UNSPLASH_KEY || 'key_not_set');

app.use(express.static('public'));

app.get('/protected/unsplash/search/photos', async function (req, res, next) {
    try {
        const unsplashKey = app.get('unsplash_key');
        const url = `https://api.unsplash.com/search/photos?page=${req.query.page || 0}&query=${encodeURIComponent(req.query.query)}&client_id=${unsplashKey}`;

        const unsplashRequest = await fetch(url);

        res.type(unsplashRequest.headers.get('Content-Type') || 'text/plain')
            .status(unsplashRequest.status)
            .send(await unsplashRequest.text());
    } catch (error) {
        next(error);
    }
});

app.get('/protected/unsplash/photos/:id/download', async function (req, res, next) {
    try {
        const unsplashKey = app.get('unsplash_key');
        const url = `https://api.unsplash.com/photos/${req.params.id}/download&client_id=${unsplashKey}`;

        const unsplashRequest = await fetch(url);

        res.type(unsplashRequest.headers.get('Content-Type') || 'text/plain')
            .status(unsplashRequest.status)
            .send(await unsplashRequest.text());
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
