const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); // Asegúrate de importar Op
const { ValidationError } = require('sequelize');
const cors = require("cors");
const db = require("../base-orm/sequelize-init");
const auth = require("../seguridad/auth");

router.use(cors());
router.use(express.json());

//------------------------------------
//-- SEGURIDAD ---------------------------
//------------------------------------

// GET: Obtener todos los sellos o filtrar por nombre con seguridad JWT
router.get("/api/sellosJWT", auth.authenticateJWT, async function (req, res, next) {
  try {
    const { rol } = res.locals.user;
    if ( rol !== "member" && rol !== "admin") {
      return res.status(403).json({ message: "Usuario no autorizado!" });
    }

    const { nombre } = req.query;
    let where = {};
    if (nombre) {
      where.Nombre = { [Op.like]: `%${nombre}%` };
    }
    let data = await db.sellos.findAll({
      where,
      attributes: ["IdSello", "Nombre", "Pais", "FechaFundacion", "ArtistasFirmados"],
      order: [["IdSello", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});


// GET /api/sellosJWT/:id - Obtener un sello específico por id con seguridad JWT
router.get("/api/sellosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }
  try {
    const id = req.params.id;
    const sello = await db.sellos.findByPk(id);
    if (sello) {
      res.status(200).json(sello);
    } else {
      res.status(404).json({ message: "Sello no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// POST: Crear un nuevo sello con autenticación JWT
router.post("/api/sellosJWT", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    let nuevoSello = await db.sellos.create(req.body);
    res.status(201).json(nuevoSello);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

// DELETE: Eliminar un sello específico con autenticación JWT
router.delete("/api/sellosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  try {
    const id = req.params.id;
    const sello = await db.sellos.findByPk(id);
    if (sello) {
      await sello.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Sello no encontrado" });
    }
  } catch (err) {
    next(err);
  }
});

// PUT: Actualizar un sello existente con seguridad JWT
router.put("/api/sellosJWT/:id", auth.authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;
  if (rol !== "admin") {
    return res.status(403).json({ message: "Usuario no autorizado!" });
  }

  try {
    const id = req.params.id;
    let sello = await db.sellos.findByPk(id);
    
    if (!sello) {
      return res.status(404).json({ error: "Sello no encontrado" });
    }

    // Actualiza el sello con los datos proporcionados en el body de la solicitud
    await sello.update(req.body);
    res.status(200).json(sello);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    } else {
      next(err);
    }
  }
});

module.exports = router;