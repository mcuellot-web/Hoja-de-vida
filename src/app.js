require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const experienciasRoutes = require("./routes/experiencias.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hoja_de_vida";

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de experiencias profesionales", docs: "/api-docs" });
});

app.use("/api/experiencias", experienciasRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => res.status(404).json({ mensaje: "Ruta no encontrada" }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });