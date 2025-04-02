const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); // Asegúrate de importar Op
const { ValidationError } = require('sequelize');
const cors = require("cors");
const db = require("../base-orm/sequelize-init");
const auth = require("../seguridad/auth"); // Importa el middleware de autenticación

router.use(cors());
router.use(express.json());

// GET: Obtener todos los géneros o filtrar por nombre con seguridad JWT
router.get("/api/generosJWT", auth.authenticateJWT, async function (req, res, next) {
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
    let data = await db.generos.findAll({
      where,
      attributes: ["IdGenero", "Nombre", "Descripcion", "Popularidad", "FechaCreacion"],
      order: [["IdGenero", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/generosJWT/:id - Obtener un género específico por id con seguridad JWT
router.get("/api/generosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }
  try {
    const id = req.params.id;
    const genero = await db.generos.findByPk(id);
    if (genero) {
      res.status(200).json(genero);
    } else {
      res.status(404).json({ message: "Género no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear un nuevo género con autenticación JWT
router.post("/api/generosJWT", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    let nuevoGenero = await db.generos.create(req.body);
    res.status(201).json(nuevoGenero);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un género específico con autenticación JWT
router.delete("/api/generosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    const id = req.params.id;
    const genero = await db.generos.findByPk(id);
    if (genero) {
      await genero.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Género no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// PUT: Actualizar un género existente con seguridad JWT
router.put("/api/generosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado!" });
  }

  try {
    const id = req.params.id;
    let genero = await db.generos.findByPk(id);
    
    if (!genero) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    // Actualiza el género con los datos proporcionados en el body de la solicitud
    await genero.update(req.body);
    res.status(200).json(genero);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

module.exports = router;