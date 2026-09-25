const http = require('http');

const AUTHOR_VALUE = '1157390';

const server = http.createServer((req, res) => {
  res.setHeader('X-Author', AUTHOR_VALUE);
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.end(AUTHOR_VALUE);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 8443;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
