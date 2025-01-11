const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const registroRoutes = require('./routes/registro');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para JSON
app.use(express.json({ limit: '50mb' }));

// Middleware para CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Redirigir la raíz a /register
app.get('/', (req, res) => {
    res.redirect('/register');
});

// Ruta para el archivo register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta para el archivo login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file;
    const filePath = path.join(__dirname, 'uploads', `image_${Date.now()}.png`);

    fs.writeFile(filePath, image.buffer, (err) => {
        if (err) {
            return res.status(500).json({ success: false, msg: 'Error al guardar la imagen' });
        }
        res.json({ success: true, msg: 'Imagen subida con éxito', filePath });
    });
});

// Rutas de autenticación y registro
app.use('/api/auth', authRoutes);
app.use('/api/registro', registroRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
