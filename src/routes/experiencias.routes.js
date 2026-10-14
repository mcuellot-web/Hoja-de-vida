const express = require("express");
const ctrl = require("../controllers/experiencias.controller");

const router = express.Router();

router.post("/", ctrl.crear);
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerPorId);
router.put("/:id", ctrl.actualizar);
router.delete("/:id", ctrl.eliminar);

module.exports = router;