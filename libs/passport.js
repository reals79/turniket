const LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport, user_model) {

  var User = user_model;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
      .then((user) => {
        if (user) {
          done(null, user.get());
        } else {
          done(user.errors, null);
        }
      });
  });

  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback : true
    },
    async function(req, username, password, done) {

      const result = await User.findAndCountAll();
      if (!result.count) {
        const user = await User.create({
            username: 'admin',
            password: 'admin!',
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString()
        });
      }

      User.findOne({ where: {username: username } })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Username does not exist' });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            console.log(password, user.password);
            return done(null, false, { message: 'Incorrect password' });
          }

          var userinfo = user.get();

          return done(null, userinfo);
        })
        .catch((err) => {
          console.log("Error:", err);
          return done(null, false, { message: 'Something went wrong with your Login' });
        });
    }
  ));

}
