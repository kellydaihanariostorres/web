const express = require('express');
const path = require('path');

const app = express();

// Configurar middleware para servir archivos estáticos desde el directorio client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// Manejar todas las demás rutas y redirigirlas al archivo index.html para que React pueda manejarlas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
