const sharp = require('sharp');
const formidable = require('formidable');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    const { width_cm, height_cm } = fields;
    const image = files.image;

    if (!image || !width_cm || !height_cm) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const metadata = await sharp(image.filepath).metadata();
      const width_px = metadata.width;
      const height_px = metadata.height;

      const width_cm_num = parseFloat(width_cm);
      const height_cm_num = parseFloat(height_cm);

      const width_dpi = width_px / (width_cm_num / 2.54);
      const height_dpi = height_px / (height_cm_num / 2.54);

      const dpi = Math.min(width_dpi, height_dpi);

      let quality;
      if (dpi >= 300) {
        quality = 'عالی';
      } else if (dpi >= 150) {
        quality = 'متوسط';
      } else {
        quality = 'ضعیف';
      }

      res.status(200).json({ dpi: Math.round(dpi), quality });
    } catch (error) {
      res.status(500).json({ error: 'Error processing the image' });
    }
  });
};
