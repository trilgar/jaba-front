const express = require('express');

const app = express();

app.use(express.static('./dist/jaba-front'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/jaba-front/'}),
);

app.listen(process.env.PORT || 8080);
