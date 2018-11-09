const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite');
const app = express();

const dbPromise = sqlite.open('./data.db');
app.use(bodyParser.urlencoded());
app.set('view engine', 'twig');

dbPromise.then((db) => {
  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, message STRING );');
});

app.get('/', async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all('SELECT message FROM messages;');
  res.render('index', { messages });
});

app.post('/message', async (req, res) => {
  const db = await dbPromise;
  await db.run('INSERT INTO messages (message) VALUES (?);', req.body.message);
  res.redirect('/');
});

app.listen(3000, () => console.log('listening on 3000'));
