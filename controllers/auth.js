const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res, next) => {
  try {
    let { name, username, password } = req.body;
    name = _.startCase(_.camelCase(name));
    const user = new User({ name, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || "/";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};

module.exports.getSignup = (req, res, next) => {
  res.status(200).render("auth/register", {
    path: "register",
    errorMessage: "",
  });
};

module.exports.signup = (req, res, next) => {
  const { email, username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render("register", {
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {
        name,
        email,
        password,
      },
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        name,
        email,
        password: hashedPass,
      });
      return user.save();
    })
    .then(() => {
      res.redirect("auth/login");
    })
    .catch((err) => console.log(err));
};
