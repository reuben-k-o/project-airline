const express = require("express"),
  router = express.Router(),
  passport = require("passport");
const { check } = require("express-validator");
const User = require("../models/user");

const catchAsync = require("../utils/catchAsync");
const auth = require("../controllers/auth");
router
  .route("/register")
  .get(auth.renderRegister)
  .post(catchAsync(auth.register));

router
  .route("/login")
  .get(auth.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    auth.login
  );

router.get("/logout", auth.logout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail already exists, Kindly choose another one!"
            );
          }
        });
      }),
  ],
  auth.signup
);

module.exports = router;
