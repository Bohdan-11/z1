const https = require('https');
const fs = require('fs');

const AUTHOR = '1157390';
const PORT = process.env.PORT || 8443;

// --- содержимое маршрутов ---

const SAMPLE_FN = `function task(x) {
  return x * this * this;
}`;

const PROMISE_FN = `function task(x) {
  return new Promise((resolve, reject) => {
    if (x < 18) resolve('yes');
    else reject('no');
  });
}`;

const FETCH_PAGE = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>fetch</title>
</head>
<body>
<input id="inp" type="text">
<button id="bt">go</button>
<script>
document.getElementById('bt').addEventListener('click', function () {
  var inp = document.getElementById('inp');
  fetch(inp.value)
    .then(function (r) { return r.text(); })
    .then(function (t) { inp.value = t; })
    .catch(function (e) { inp.value = 'error: ' + e.message; });
});
</script>
</body>
</html>`;

// --- общие заголовки для всех ответов ---

function baseHeaders(extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'X-Author': AUTHOR,
  }, extra || {});
}

// --- маршрутизация ---

const routes = {
  '/': {
    type: 'text/plain; charset=UTF-8',
    body: AUTHOR,
  },
  '/login/': {
    type: 'text/plain; charset=UTF-8',
    body: AUTHOR,
  },
  '/sample/': {
    type: 'text/plain; charset=UTF-8',
    body: SAMPLE_FN,
  },
  '/promise/': {
    type: 'text/plain; charset=UTF-8',
    body: PROMISE_FN,
  },
  '/fetch/': {
    type: 'text/html; charset=UTF-8',
    body: FETCH_PAGE,
  },
};

const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

const server = https.createServer(options, (req, res) => {
  const url = req.url.split('?')[0];
  const route = routes[url];

  if (!route) {
    res.writeHead(404, baseHeaders({ 'Content-Type': 'text/plain; charset=UTF-8' }));
    res.end('Not Found');
    return;
  }

  res.writeHead(200, baseHeaders({ 'Content-Type': route.type }));
  res.end(route.body);
});

server.listen(PORT, () => {
  console.log(`HTTPS listening on ${PORT}`);
});
