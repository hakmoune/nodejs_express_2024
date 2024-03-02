const mongoose = require("mongoose");
const { Schema } = mongoose;

// Chaque schéma correspond à une collection MongoDB
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
});

// Une instance d'un modèle est appelée un document
// Le premier argument "Employee" est le nom singulier de la collection à laquelle votre modèle est destiné.
// Mongoose recherche automatiquement la version plurielle et minuscule du nom de votre modèle.
// le "model" "Employee" est destiné à la collection "employees" dans la base de données.
module.exports = mongoose.model("Employee", employeeSchema);
