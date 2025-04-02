const express = require("express");
const router = express.Router();
const { ValidationError } = require('sequelize');
const cors = require("cors");
const db = require("../base-orm/sequelize-init");

router.use(cors());
router.use(express.json());

// GET: Obtener todas las canciones
router.get("/api/canciones", async function (req, res, next) {
  try {
    let data = await db.canciones.findAll({
      attributes: ["IdCancion", "Titulo", "Duracion", "AlbumId"],
      include: [{
        model: db.albumes,
        as: 'album',
        attributes: ['Titulo']
      }]
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/canciones/:id - Obtener una cancion específico por id
router.get("/api/canciones/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const cancion = await db.canciones.findByPk(id, {
      include: [{
        model: db.albumes,
        as: 'album',
        attributes: ['Titulo']
      }]
    });
    if (cancion) {
      res.status(200).json(cancion);
    } else {
      res.status(404).json({ message: "Canción no encontrada" });
    }
  } catch (err) {
    next(err);
  }
});

/// POST: Crear un nuevo cancion
router.post("/api/canciones", async function (req, res, next) {
  try {
    const nuevaCancion = await db.canciones.create(req.body);
    res.status(201).json(nuevaCancion);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// PUT: Actualizar una canción existente
router.put("/api/canciones/:id", async function (req, res, next) {
  try {
    let cancion = await db.canciones.findByPk(req.params.id);
    if (cancion) {
      await cancion.update(req.body);
      res.json(cancion);
    } else {
      res.status(404).json({ error: "Canción no encontrada" });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar una canción
router.delete("/api/canciones/:id", async function (req, res, next) {
  try {
    const cancion = await db.canciones.findByPk(req.params.id);
    if (!cancion) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    await cancion.destroy();
    res.status(204).end();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    console.error(err);
    next(err);
  }
});

module.exports = router;