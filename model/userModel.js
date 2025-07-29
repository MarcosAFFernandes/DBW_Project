const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  imagem: { type: String },
  jogosRealizados: { type: Number, default: 0 },
  perguntasCertas: { type: Number, default: 0 },
  perguntasErradas: { type: Number, default: 0 },
});

userSchema.plugin(passportLocalMongoose); //Vai adicionar username e password

//Vamos criar um modelo chamado "User" a partir do esquema e //vamos exporta-lo
module.exports = mongoose.model("User", userSchema);
