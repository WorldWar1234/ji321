const url = require('url');
const DEFAULT_QUALITY = 40;

function params(req) {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  let url = query.url;
  if (!url) throw new Error('URL parameter is required');

  url = decodeURIComponent(url);
  const webp = !query.jpeg;
  const grayscale = query.bw != 0;
  const quality = parseInt(query.l, 10) || DEFAULT_QUALITY;

  return { url, webp, grayscale, quality };
}

module.exports = params;
