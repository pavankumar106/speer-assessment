const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return done(null, false, { message: "No user found with that email" });
    }

    if (password !== user.password) {
      return done(null, false, { message: "Password incorrect" });
    }

    return done(null, user);
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, User.findById(id));
  });
};

module.exports = initialize;
