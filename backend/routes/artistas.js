const express = require("express");
const router = express.Router();
const { ValidationError } = require('sequelize');
const db = require("../base-orm/sequelize-init");

router.get("/api/artistas", async (req, res, next) => {
  try {
    const data = await db.artistas.findAll({
      attributes: ["IdArtista", "Nombre", "Nacionalidad", "AñosActivos", "FechaInicio"],
      include: [{
        model: db.sellos,
        as: 'sello',
        attributes: ['Nombre']
      }]
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/artistas/:id - Obtener un artista específico por id
router.get("/api/artistas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const artista = await db.artistas.findByPk(id, {
      include: [{
        model: db.sellos,
        as: 'sello',
        attributes: ['Nombre']
      }]
    });
    if (artista) {
      res.status(200).json(artista);
    } else {
      res.status(404).json({ message: "Artista no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

/// POST: Crear un nuevo artista
router.post("/api/artistas", async function (req, res, next) {
  try {
    const nuevoArtista = await db.artistas.create(req.body);
    res.status(201).json(nuevoArtista);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

router.put("/api/artistas/:id", async (req, res) => {
  try {
    const item = await db.artistas.findOne({
      where: { IdArtista: req.params.id },
    });
    if (!item) {
      return res.status(404).json({ message: "Artista no encontrado" });
    }
    item.Nombre = req.body.Nombre;
    item.Nacionalidad = req.body.Nacionalidad;
    item.AñosActivos = req.body.AñosActivos;
    item.FechaInicio = req.body.FechaInicio;
    await item.save();
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = '';
      err.errors.forEach((x) => messages += `${x.path}: ${x.message}\n`);
      res.status(400).json({ message: messages });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un artista específico 
router.delete("/api/artistas/:id", async (req, res) => {
  try {
    let artista = parseInt(req.params.id);
    if (isNaN(artista)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    let artistas = await db.artistas.findOne({ where: {  IdArtista: artista } });

    if (artistas) {
      await artistas.destroy();
      res.json({ message: "artista eliminado" });
    } else {
      res.status(404).json({ message: "artista no encontrado" });
    }
  } catch (error) {
    console.error(`Error al eliminar el artista con ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error al eliminar el artista" });
  }
});

module.exports = router;