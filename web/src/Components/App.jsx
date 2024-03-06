const express = require('express');
const path = require('path');

const app = express();

// Configurar middleware para servir archivos estáticos desde el directorio client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// Manejar ruta de inicio (renderiza el index.html de tu aplicación React)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Otras rutas y lógica de servidor

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
