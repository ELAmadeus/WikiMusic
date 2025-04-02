const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); // Asegúrate de importar Op
const { ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");
const auth = require("../seguridad/auth");
const { conciertos, artistas } = require("../base-orm/sequelize-init");

router.use(express.json());


//------------------------------------
//-- SEGURIDAD ---------------------------
//------------------------------------

// GET /api/conciertosJWT - Obtener todos los conciertos o filtrar por nombre
router.get("/api/conciertosJWT", auth.authenticateJWT, async function (req, res, next) {
  try {
    const { rol } = res.locals.user;
    if (rol !== "member" && rol !== "admin") {
      return res.status(403).json({ message: "Usuario no autorizado!" });
    }

    const { nombre } = req.query;
    let where = {};
    if (nombre) {
      where.Nombre = { [Op.like]: `%${nombre}%` };
    }
    let data = await conciertos.findAll({
      where,
      attributes: ["IdConcierto", "Nombre", "Fecha", "Lugar", "ArtistaId", "DuracionMinutos"],
      include: [{
        model: artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/conciertos/:id - Obtener un concierto específico por id
router.get("/api/conciertosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }
  try {
    const id = req.params.id;
    const concierto = await conciertos.findByPk(id, {
      include: [{
        model: artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    if (concierto) {
      res.status(200).json(concierto);
    } else {
      res.status(404).json({ message: "Concierto no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear un nuevo sello con autenticación JWT
router.post("/api/conciertosJWT", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    let nuevoConcierto = await db.conciertos.create(req.body);
    res.status(201).json(nuevoConcierto);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// PUT: Actualizar un sello existente con seguridad JWT
router.put("/api/conciertosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado!" });
  }

  try {
    const id = req.params.id;
    let concierto = await db.conciertos.findByPk(id);
    
    if (!concierto) {
      return res.status(404).json({ error: "Concierto no encontrado" });
    }

    // Actualiza el sello con los datos proporcionados en el body de la solicitud
    await concierto.update(req.body);
    res.status(200).json(concierto);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un concierto específico con autenticación JWT
router.delete("/api/conciertosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    const id = req.params.id;
    const concierto = await db.conciertos.findByPk(id);
    if (concierto) {
      await concierto.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Concierto no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;