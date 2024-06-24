let indexCont = async function (req, res) {
  if (!req.isAuthenticated()) {
    // Se não está autenticado, vai para o login!
    console.log("You do not have acess!");
    return res.redirect("/login");
  }
  res.render("register");
};

//Exportamos o indexCont para depois serem usados nas rotas
module.exports = indexCont;
