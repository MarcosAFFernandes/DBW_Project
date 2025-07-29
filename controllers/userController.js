const User = require("../model/userModel");
const multer = require("multer");

const userGet = function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }
};

const registerGet = function (req, res) {
  res.render("register");
};

const userPost = async function (req, res) {
  const { email, username, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  const user = new User({
    email,
    username,
    imagem:
      "data:image/jpeg;base64,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",
  });
  await User.register(user, password);
  res.redirect("/login");
};

const atualizarInformacoesUsuario = async function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }

  const userId = req.user.id;
  const { username, password, passwordConfirm, email, imagem } = req.body;

  try {
    if (password !== passwordConfirm) {
      res.redirect("/profile");
      return;
    }

    // Update only the properties that were sent in the request body
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (imagem) updates.imagem = imagem;

    // Update password only if a new password is provided
    if (password) {
      const user = await User.findById(userId);
      await user.setPassword(password);
      await user.save();
    }

    // Update other user information
    await User.findByIdAndUpdate(userId, updates);

    if (username || email || password) {
      res.redirect("/login");
    } else {
      res.redirect("/profile");
    }
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Passwords do not match" });
  }
};

const loginGet = function (req, res) {
  res.render("login");
};

const homeGet = function (req, res) {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    const imagem = req.user.imagem;
    res.render("home", { username, imagem });
  } else {
    res.redirect("/login");
  }
};

const roomGet = function (req, res) {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    const imagem = req.user.imagem;
    const roomId = req.params.id;
    res.render("room", { roomId, username, imagem });
  } else {
    res.redirect("/login");
  }
};

const quizGet = function (req, res) {
  if (req.isAuthenticated()) {
    res.render("quiz");
  } else {
    res.redirect("/login");
  }
};

const profileGet = function (req, res) {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    const imagem = req.user.imagem;
    res.render("profile", { username, imagem });
  } else {
    res.redirect("/login");
  }
};

const atualizarImagemPerfil = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const imagePath = "uploads/" + req.file.filename;
    req.user.imagem = imagePath;
    await req.user.save(); // Use await with save method to handle promises
    res.redirect("/profile");
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const statisticsGet = function (req, res) {
  if (req.isAuthenticated()) {
    const username = req.user.username;
    const imagem = req.user.imagem;
    const jogosRealizados = req.user.jogosRealizados;
    const perguntasCertas = req.user.perguntasCertas;
    const perguntasErradas = req.user.perguntasErradas;
    
    res.render("statistics", { username, imagem, jogosRealizados, perguntasCertas, perguntasErradas });
  } else {
    res.redirect("/login");
  }
};


const logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  });
};

module.exports = {
  userGet,
  registerGet,
  userPost,
  atualizarInformacoesUsuario,
  loginGet,
  homeGet,
  roomGet,
  quizGet,
  profileGet,
  atualizarImagemPerfil,
  statisticsGet,
  //updateStatistics,
  logout,
};
