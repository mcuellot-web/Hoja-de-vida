const mongoose = require("mongoose");

const experienciaSchema = new mongoose.Schema(
  {
    cargo: { type: String, required: [true, "El cargo es obligatorio"], trim: true },
    empresa: { type: String, required: [true, "La empresa es obligatoria"], trim: true },
    ubicacion: { type: String, trim: true },
    fechaInicio: { type: Date, required: [true, "La fecha de inicio es obligatoria"] },
    fechaFin: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.fechaInicio;
        },
        message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      },
    },
    actualmente: { type: Boolean, default: false },
    descripcion: { type: String, trim: true },
    logros: [{ type: String, trim: true }],
    tecnologias: [{ type: String, trim: true }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Experiencia", experienciaSchema);