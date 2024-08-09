const sharp = require('sharp');
const redirect = require('./redirect');

function compress(req, res) {
  const { url, webp, grayscale, quality } = req.params;
  const format = webp ? 'webp' : 'jpeg';

  sharp(req.buffer)
    .grayscale(grayscale)
    .toFormat(format, {
      quality: quality,
      progressive: true,
      optimizeScans: true,
    })
    .toBuffer((err, output, info) => {
      if (err || !info) {
        return redirect(req, res);
      }

      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', info.size);
      res.setHeader('x-original-size', req.params.originSize);
      res.setHeader('x-bytes-saved', req.params.originSize - info.size);
      res.setHeader('content-encoding', 'identity');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
      res.writeHead(200);
      res.end(output);
    });
}

module.exports = compress;
