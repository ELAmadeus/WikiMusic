const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");
const auth = require("../seguridad/auth");
const { biografias, artistas } = require("../base-orm/sequelize-init");

router.use(express.json());

// GET /api/biografiasJWT - Obtener todas las biografias o filtrar por nombre del artista
router.get("/api/biografiasJWT", auth.authenticateJWT, async function (req, res, next) {
  try {
    const { rol } = res.locals.user;
    if (rol !== "member" && rol !== "admin") {
      return res.status(403).json({ message: "Usuario no autorizado!" });
    }

    const { nombre } = req.query;
    let where = {};
    if (nombre) {
      where = {
        '$artista.Nombre$': { [Op.like]: `%${nombre}%` }
      };
    }

    let data = await biografias.findAll({
      where,
      attributes: ["Id", "Historia", "ArtistaId", "Wikipedia"],
      include: [{
        model: artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error al obtener biografias:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/biografiasJWT/:id - Obtener una biografia específica por id
router.get("/api/biografiasJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }
  try {
    const id = req.params.id;
    const biografia = await biografias.findByPk(id, {
      include: [{
        model: artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    if (biografia) {
      res.status(200).json(biografia);
    } else {
      res.status(404).json({ message: "Biografia no encontrada" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear una nueva biografia con autenticación JWT
router.post("/api/biografiasJWT", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    let nuevaBiografia = await db.biografias.create(req.body);
    res.status(201).json(nuevaBiografia);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// PUT: Actualizar una biografia existente con seguridad JWT
router.put("/api/biografiasJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado!" });
  }

  try {
    const id = req.params.id;
    let biografia = await db.biografias.findByPk(id);
    
    if (!biografia) {
      return res.status(404).json({ error: "Biografia no encontrada" });
    }

    // Actualiza la biografia con los datos proporcionados en el body de la solicitud
    await biografia.update(req.body);
    res.status(200).json(biografia);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar una biografia específica con autenticación JWT
router.delete("/api/biografiasJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    const id = req.params.id;
    const biografia = await db.biografias.findByPk(id);
    if (biografia) {
      await biografia.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Biografia no encontrada" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;