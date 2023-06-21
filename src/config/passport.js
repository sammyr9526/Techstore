import passport from "passport";
import User from "../models/User";
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, cb) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        return cb(null, false, { message: "Not user found" });
      } else {
        const match = await user.comparePassword(password);
        if (match) {
          return cb(null, user);
        } else {
          return cb(null, false, { message: "Incorrect Password" });
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .exec(function (err, user) {
      done(err, user);
    });
});
