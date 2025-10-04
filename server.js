const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file.filename;

  const newProject = { title, description, image: imagePath };
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data.push(newProject);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  res.redirect('/admin');
});

app.get('/projects', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});