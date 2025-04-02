const express = require("express");
const router = express.Router();
const { ValidationError } = require('sequelize');
const cors = require("cors");
const db = require("../base-orm/sequelize-init");

router.use(cors());
router.use(express.json());

// GET: Obtener todos los premios
router.get("/api/premios", async function (req, res, next) {
  try {
    let data = await db.premios.findAll({
      attributes: ["IdPremio", "Nombre", "Descripcion", "FechaEntrega", "ArtistaId"],
      include: [{
        model: db.artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/premios/:id - Obtener un premio específico por id
router.get("/api/premios/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const premio = await db.premios.findByPk(id, {
      include: [{
        model: db.artistas,
        as: 'artista',
        attributes: ['Nombre']
      }]
    });
    if (premio) {
      res.status(200).json(premio);
    } else {
      res.status(404).json({ message: "Premio no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear un nuevo premio
router.post("/api/premios", async function (req, res, next) {
  try {
    const nuevoPremio = await db.premios.create(req.body);
    res.status(201).json(nuevoPremio);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// PUT: Actualizar un premio existente
router.put("/api/premios/:id", async function (req, res, next) {
  try {
    const premio = await db.premios.findByPk(req.params.id);
    if (premio) {
      await premio.update(req.body);
      res.json(premio);
    } else {
      res.status(404).json({ error: "Premio no encontrado" });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un premio existente
router.delete("/api/premios/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await db.premios.destroy({
      where: { IdPremio: id }
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Premio no encontrado" });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    next(err);
  }
});

module.exports = router;