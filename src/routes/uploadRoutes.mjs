import express from 'express';
import upload from '../config/multer.mjs';

const router = express.Router();

router.post('/imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }

  const fileUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;