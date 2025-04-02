require("./base-orm/sqlite-init.js");
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json()); // para leer JSON en el body  

app.get('/', (req, res) => {
    res.send('Backend inicial para música');
});

//Rutas
const generosRouter = require("./routes/generos");
app.use(generosRouter);

const albumesRouter = require("./routes/albumes");
app.use(albumesRouter);

const cancionesRouter = require("./routes/canciones");
app.use(cancionesRouter);

const artistasRouter = require("./routes/artistas");
app.use(artistasRouter);

const biografiasRouter = require("./routes/biografias.js");
app.use(biografiasRouter);

const sellosRouter = require("./routes/sellos");
app.use(sellosRouter);

const conciertosRouter = require("./routes/conciertos");
app.use(conciertosRouter);

const premiosRouter = require("./routes/premios");
app.use(premiosRouter);

const seguridadRouter = require("./routes/seguridad");
app.use(seguridadRouter);

const sesionRouter = require("./routes/login.js");
app.use('/api/user',sesionRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


// levantar servidor
if (!module.parent) {   
    const port = process.env.PORT || 3000;   
    app.locals.fechaInicio = new Date();
    app.listen(port, () => {
      console.log(`Página inicializada en el puerto ${port}`);
    });
  }
  module.exports = app;