const router = require("express").Router();
const userCont = require("../controllers/userController");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: 'uploads' });

router.get("/", userCont.userGet);
router.get("/register", userCont.registerGet);
router.get("/login", userCont.loginGet);
router.get("/logout", userCont.logout);
router.get("/home", userCont.homeGet);
router.get("/room", userCont.roomGet);
router.get("/profile", userCont.profileGet);
router.get("/statistics", userCont.statisticsGet);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/home");
  }
);

router.post("/profile/atualiza-imagem", upload.single("imagem"), userCont.atualizarImagemPerfil);
router.post("/profile/atualizar-dados", userCont.atualizarInformacoesUsuario);
//router.post("/statistics/update", userCont.updateStatistics);
router.post("/register", userCont.userPost);

module.exports = router;
