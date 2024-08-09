const DEFAULT_QUALITY = 10;

function params(req, res) {
  const { url, jpeg, bw, l } = req.query;

  if (!url) {
    res.writeHead(400);
    res.end('URL parameter is required');
    return;
  }

  const urls = Array.isArray(url) ? url.join('&url=') : url;
  const cleanedUrl = urls.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');

  const webp = !jpeg;
  const grayscale = bw !== '0';
  const quality = parseInt(l, 10) || DEFAULT_QUALITY;

  return { url: cleanedUrl, webp, grayscale, quality };
}

module.exports = params;
