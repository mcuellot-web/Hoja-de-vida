const mongoose = require("mongoose");
const Experiencia = require("../models/Experiencia");

const idInvalido = (id) => !mongoose.isValidObjectId(id);

const manejarError = (res, error) => {
  if (error.name === "ValidationError") {
    const detalles = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: "Datos inválidos", detalles });
  }
  console.error(error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
};

// CREATE
exports.crear = async (req, res) => {
  try {
    const experiencia = await Experiencia.create(req.body);
    res.status(201).json(experiencia);
  } catch (error) {
    manejarError(res, error);
  }
};

// READ (todas, de la más reciente a la más antigua)
exports.listar = async (req, res) => {
  try {
    const experiencias = await Experiencia.find().sort({ fechaInicio: -1 });
    res.json(experiencias);
  } catch (error) {
    manejarError(res, error);
  }
};

// READ (una)
exports.obtenerPorId = async (req, res) => {
  try {
    if (idInvalido(req.params.id)) return res.status(400).json({ mensaje: "ID inválido" });
    const experiencia = await Experiencia.findById(req.params.id);
    if (!experiencia) return res.status(404).json({ mensaje: "Experiencia no encontrada" });
    res.json(experiencia);
  } catch (error) {
    manejarError(res, error);
  }
};

// UPDATE
exports.actualizar = async (req, res) => {
  try {
    if (idInvalido(req.params.id)) return res.status(400).json({ mensaje: "ID inválido" });
    const experiencia = await Experiencia.findById(req.params.id);
    if (!experiencia) return res.status(404).json({ mensaje: "Experiencia no encontrada" });
    experiencia.set(req.body);
    await experiencia.save();
    res.json(experiencia);
  } catch (error) {
    manejarError(res, error);
  }
};

// DELETE
exports.eliminar = async (req, res) => {
  try {
    if (idInvalido(req.params.id)) return res.status(400).json({ mensaje: "ID inválido" });
    const experiencia = await Experiencia.findByIdAndDelete(req.params.id);
    if (!experiencia) return res.status(404).json({ mensaje: "Experiencia no encontrada" });
    res.json({ mensaje: "Experiencia eliminada correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
};