const mongoose = require('mongoose');
const Models = require('./models/model.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// USE requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
//app.use(cors());
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://jackoc-myflix.onrender.com/', 'http://jackoc-myflix.onrender.com/login', 'https://jackocflix.netlify.app/login', 'https://jackocflix.netlify.app', 'http://localhost:4200'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const { check, validationResult } = require('express-validator');



let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// USER orientated URL requests below ------------------- 

/**
 * @property {number} ID - User ID
 * @property {string} Username - User username
 * @property {string} Password - User password
 * @property {string} Email - User email
 * @property {Date} Birthday - User birthday
 */
 


/**
 * Sign up - Allows new users to register.
 *
 * @route POST /users
 * @param {string} req.body.Username - User's username
 * @param {string} req.body.Password - User's password
 * @param {string} req.body.Email - User's email
 * @param {Date} req.body.Birthday - User's birthday
 * @returns {User} User object
 */

app.post('/users', 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/*
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }); 
  
  */

/**
 * Get user by username.
 *
 * @route GET /users/:Username
 * @param {string} req.params.Username - User's username
 * @returns {User} User object
 */

app.get('/users/:Username',  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });



/**
 * Update a user's info, by username.
 *
 * @route PUT /users/:Username
 * @param {string} req.params.Username - User's username
 * @param {string} req.body.Username - Updated username
 * @param {string} req.body.Password - Updated password
 * @param {string} req.body.Email - Updated email
 * @param {Date} req.body.Birthday - Updated birthday
 * @returns {User} Updated user object
 */

app.put('/users/:Username', passport.authenticate('jwt', {session: false}), 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

/**
 * Allows users to add a movie to their list of favorites.
 *
 * @route POST /users/:Username/movies/:MovieID
 * @param {string} req.params.Username - User's username
 * @param {string} req.params.MovieID - Movie ID to add to favorites
 * @returns {User} Updated user object with list of favorite movies
 */

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FaveMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

/**
 * Delete movie from user favorites.
 *
 * @route DELETE /users/:Username/movies/:MovieID
 * @param {string} req.params.Username - User's username
 * @param {string} req.params.MovieID - Movie ID to remove from favorites
 * @returns {User} Updated user object with updated list of favorite movies
 */

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FaveMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

/**
 * Delete user.
 *
 * @route DELETE /users/:Username
 * @param {string} req.params.Username - User's username
 * @returns {string} Success message or error message
 */

app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


// movies related URL requests below --------------- 

/** 
 * Get request for homepage
 * 
 */

app.get('/', (req, res) => {
    res.send("If you're looking for movies, you've come to the right place. Try adding something else to your URL request to get this party started");
}); 

/**
 * Get all movies.
 *
 * @route GET /movies
 * @returns {Movie[]} Array of movie objects
 */

app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


/**
 * Get one movie by Title.
 *
 * @route GET /movies/:Title
 * @param {string} req.params.Title - Movie title
 * @returns {Movie} Movie object
 */

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/**
 * Get Movie Genre by Genre.
 *
 * @route GET /movies/genre/:genreName
 * @param {string} req.params.genreName - Genre name
 * @returns {Genre} Genre object
 */

app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    });

/**
 * Get Movie Director by Director.
 *
 * @route GET /movies/director/:directorName
 * @param {string} req.params.directorName - Director name
 * @returns {Director} Director object
 */

app.get('/movies/director/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    });

//

/**
 * Error handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {function} next - The next function.
 */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, it looks like there was a glitch in the Matrix!');
  });

/**
 * Start the server.
 */

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});