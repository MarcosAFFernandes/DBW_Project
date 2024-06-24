let router = require("express").Router();
let indexCont = require("../controllers/indexController");

//INDEX ROUTE
//Esta rota é executado quando o utilizador faz um GET request e executa o middleware indexCont (defefenido nos controladores) no URL => localhost:3000.
router.get("/login", indexCont);

//Exportamos a rota para ser chemado no index.js
module.exports = router;
