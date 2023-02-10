const mongoose = require('mongoose');
const Models = require('./models/model.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// USE requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// USER orientated URL requests below ------------------- 

// allow new users to register POST/ CREATE
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
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

  // Get all users
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



//  Allow users to update their user info (name); UPDATE // PUT

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    
    let user = users.find( user => user.id == id ); // need a double == not triple. As user.id is a number and id is a string

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("user not found")
    }
})

// allow users to add a movie to their list of favorites POST

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.faveMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s list`);
    } else {
        res.status(400).send("user not found")
    }
})

// allow users to delete movies from faveMovies list DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.faveMovies = user.faveMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s list`);
    } else {
        res.status(400).send("user not found")
    }
})

// allow users to deregister DELETE


app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id)
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send("user not found")
    }
})


// movies related URL requests below --------------- 

//GET/READ

app.get('/', (req, res) => {
    res.send("If you're looking for movies, you've come to the right place. Try adding something else to your URL request to get this party started");
}); 

app.get('/movies', (req, res) => { //Return a list of ALL movies to the user;
    res.json(movies);
});

//specific movie by title GET/READ

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title );

    if (movie) {
    res.status(200).json(movie);
    } else {
    res.status(400).send('This movie did not make the list - try something classic like Zoolander')
    }
})

// specific genre GET/READ

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName ).genre;

    if (genre) {
    res.status(200).json(genre);
    } else {
    res.status(400).send('No such genre exists')
    }
})

// director by name GET/READ

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName ).director;

    if (director) {
    res.status(200).json(director);
    } else {
    res.status(400).send("This director didn't make the cut this time")
    }
})

//











//ERROR handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, it looks like there was a glitch in the Matrix!');
  });

// LISTEN
app.listen(8080, () =>{
    console.log('Your app is listening on port 8080.');
  });