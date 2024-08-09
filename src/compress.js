const Jimp = require('jimp');
const redirect = require('./redirect');

async function compress(req, res, input) {
  const format = req.params.webp ? Jimp.MIME_WEBP : Jimp.MIME_JPEG;
  const quality = req.params.quality;

  try {
    const image = await Jimp.read(input);

    if (req.params.grayscale) {
      image.greyscale();
    }

    const output = await image.getBufferAsync(format, { quality });

    res.setHeader('content-type', format);
    res.setHeader('content-length', output.length);
    res.setHeader('x-original-size', req.params.originSize);
    res.setHeader('x-bytes-saved', req.params.originSize - output.length);
    res.status(200).send(output);
  } catch (err) {
    return redirect(req, res);
  }
}

module.exports = compress;
