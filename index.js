require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let counter = 0;
let shortUrls = {};

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    counter += 1;
    shortUrls[counter] = url;
    res.send({ original_url: url, short_url: counter });
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const url = shortUrls[id];
  res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
