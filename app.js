import express from 'express';
import { main } from './api.js';
import { fileUpload } from './multer.js';
import cors from 'cors';
import { unlink } from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 5000; // fallback for local dev

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello AI :)');
});

app.post('/ask', fileUpload, async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const path = req.file.path;

    const result = await main(content, path);

    // ✅ safely remove uploaded file after processing
    await unlink(path).catch((err) => {
      console.warn('Could not delete file:', err.message);
    });

    res.json({ result });
  } catch (error) {
    console.error('Error in /ask:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
