const express = require('express');
const sharp = require('sharp');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/check-quality', async (req, res) => {
  try {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      const image = sharp(buffer);
      const metadata = await image.metadata();

      const isOk = metadata.width >= 2000 && metadata.height >= 2000;

      res.json({
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        qualityOk: isOk
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Image Quality API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
