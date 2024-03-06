const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken'); // Importa la librería JWT para manejar tokens de autenticación

const app = express();

// Configurar middleware para servir archivos estáticos desde el directorio client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// Middleware para verificar el token de autenticación
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, 'secreto'); // Reemplaza 'secreto' con tu secreto real

    // Agregar el usuario decodificado al objeto de solicitud para su uso posterior en las rutas protegidas
    req.user = decoded.user;

    // Continuar con la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticación inválido' });
  }
};

// Rutas protegidas
app.get('/api/protegido', verifyToken, (req, res) => {
  res.json({ message: 'Ruta protegida, usuario autenticado' });
});

// Manejar todas las demás rutas y redirigirlas al archivo index.html para que React pueda manejarlas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
