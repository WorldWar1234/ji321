const sharp = require('sharp');
const redirect = require('./redirect');

function compress(params, res, input) {
  const format = params.webp ? 'webp' : 'jpeg';

  sharp(input)
    .grayscale(params.grayscale)
    .toFormat(format, {
      quality: params.quality,
      progressive: true,
      optimizeScans: true,
    })
    .toBuffer((err, output, info) => {
      if (err || !info) {
        return redirect(params, res);
      }

      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', info.size);
      res.setHeader('x-original-size', params.originSize);
      res.setHeader('x-bytes-saved', params.originSize - info.size);
      res.setHeader('content-encoding', 'identity');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
      res.writeHead(200);
      res.end(output);
    });
}

module.exports = compress;
