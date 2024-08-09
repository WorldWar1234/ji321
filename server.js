const http = require('http');
const url = require('url');
const fetch = require('node-fetch');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');
const redirect = require('./src/redirect');

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    const paramsObj = params(req, res);
    if (!paramsObj) {
      return;
    }

    const url = paramsObj.url;

    try {
      const response = await fetch(url, {
        timeout: 10000,
      //  redirect: 'follow',
        maxRedirects: 5,
      //  compress: true,
       // agent: new https.Agent({ rejectUnauthorized: false }),
      });
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      paramsObj.originType = response.headers.get('content-type') || '';
      paramsObj.originSize = buffer.length;

      if (shouldCompress(paramsObj)) {
        req.params = paramsObj;
        req.buffer = buffer;
        compress(req, res);
      } else {
        req.params = paramsObj;
        redirect(req, res);
      }
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end('Error fetching the image.');
    }
  } else if (pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
