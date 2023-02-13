const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport'); // Local passport.js file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // this is the Username being encoded
        expiresIn: '7d', // token to expire in 7days
        algorithm: 'HS256' // this is algorithm used to 'sign' or encode values on JWT
    });
}

/* POST login. */ 
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                  message: 'Something is not right',
                  user: user
                });
              }
              req.login(user, { session: false }, (error) => {
                if (error) {
                  res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
              });
            })(req, res);
          });
        }