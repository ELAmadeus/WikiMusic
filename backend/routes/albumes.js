const express = require("express");
const router = express.Router();
const { ValidationError } = require("sequelize");
const cors = require("cors");
const db = require("../base-orm/sequelize-init");

router.use(cors());
router.use(express.json());

// GET: Obtener todos los álbumes
router.get("/api/albumes", async function (req, res, next) {
  try {
    let data = await db.albumes.findAll({
      attributes: ["IdAlbum", "Titulo", "ArtistaId", "GeneroId", "FechaLanzamiento", "CantidadCanciones"],
      include: [
        {
          model: db.artistas,
          as: 'artista',
          attributes: ['Nombre']
        },
        {
          model: db.generos,
          as: 'genero',
          attributes: ['Nombre']
        }
      ]
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/albumes/:id - Obtener un álbum específico por id
router.get("/api/albumes/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const album = await db.albumes.findByPk(id, {
      include: [
        {
          model: db.artistas,
          as: 'artista',
          attributes: ['Nombre']
        },
        {
          model: db.generos,
          as: 'genero',
          attributes: ['Nombre']
        }
      ]
    });
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({ message: "Album no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear un nuevo álbum
router.post("/api/albumes", async function (req, res, next) {
  try {
    const nuevoAlbum = await db.albumes.create(req.body);
    res.status(201).json(nuevoAlbum);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// PUT: Actualizar un álbum existente
router.put("/api/albumes/:id", async function (req, res, next) {
  try {
    const album = await db.albumes.findByPk(req.params.id);
    if (album) {
      await album.update(req.body);
      res.json(album);
    } else {
      res.status(404).json({ error: "Álbum no encontrado" });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un album específico 
router.delete("/api/albumes/:id", async (req, res) => {
  try {
    let album = parseInt(req.params.id);
    if (isNaN(album)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    let albums = await db.albumes.findOne({ where: {  IdAlbum: album } });

    if (albums) {
      await albums.destroy();
      res.json({ message: "album eliminado" });
    } else {
      res.status(404).json({ message: "album no encontrado" });
    }
  } catch (error) {
    console.error(`Error al eliminar el album con ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error al eliminar el album" });
  }
});

module.exports = router;