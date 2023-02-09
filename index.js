const mongoose = require('mongoose');
const Models = require('./models/model.js')

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// USE requests

app.use(bodyParser.json());

// define users array
let users = [
    {
        id: 1,
        name: 'filmlover69',
        faveMovies: []
    },
    {
        id: 2,
        name: 'Hansel-so-hot-right-now',
        faveMovies: ['Zoolander']
    }
]

// define movies array

let movies = [
    {
        title: 'American Psycho',
        release_date: 'May 6, 2011',
        genre: {
            name: 'Horror',
            description: 'Scary and bloody'
        },
        director: {
            name: 'Mary Harron',
            birthdate: 'January 12, 1953',
            bio: 'Mary Harron (born January 12, 1953) is a Canadian filmmaker and screenwriter. She gained recognition for her role in writing and directing several independent films, including I Shot Andy Warhol (1996), American Psycho (2000), and The Notorious Bettie Page (2005)'
        },
        description: 'A wealthy New York City investment banking executive, Patrick Bateman, hides his alternate psychopathic ego from his co-workers and friends'
    },
    {
        title: 'Shrek',
        release_date: 'April 22, 2001',
        genre: {
            name: 'Adventure',
            description: 'Walk around looking for stuff, usually with a princess in tow'
        },
        director: {
            name: 'Andrew Adamson',
            birthdate: 'December 1, 1966',
            bio: 'Andrew Adamson was born on 1 December 1966 in Auckland, New Zealand. He is a producer and director, known for Shrek 2 (2004), Shrek (2001) and The Chronicles of Narnia: The Lion, the Witch and the Wardrobe (2005).'
        },
        description: 'A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest and rescue a princess for the lord in order to get his land back.'
    },
    {
        title: 'The Notebook',
        release_date: 'June 25, 2004',
        genre: {
            name: 'Romance',
            description: 'Gets you right in the feels. Bring tissues.'
        },
        director: {
            name: 'Nick Cassavetes',
            birthdate: '01/01/61',
            bio: 'Nick Cassavetes was born in New York City, the son of actress Gena Rowlands and Greek-American actor and film director John Cassavetes. As a child, he appeared in two of his father\'s films: Husbands (1970) and A Woman Under the Influence (1974).'
        },
        description: 'A poor yet passionate young man (Ryan Gosling) falls in love with a rich young woman (Rachel McAdams), giving her a sense of freedom, but they are soon separated because of their social differences.'
    },
    {
        title: 'Zoolander',
        release_date: 'September 28, 2001',
        genre: {
            name: 'Comedy',
            description: 'It\'s all about the laughs'
        },
        director: {
            name: 'Ben Stiller',
            birthdate: 'November 30, 1965',
            bio: 'Benjamin Edward Meara Stiller was born on November 30, 1965, in New York City, New York, to legendary comedians Jerry Stiller and Anne Meara. His father was of Austrian Jewish and Polish Jewish descent, and his mother was of Irish Catholic descent (she converted to Judaism).'
        },
        description: 'At the end of his career, a clueless fashion model is brainwashed to kill the Prime Minister of Malaysia.'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        release_date: 'September 28, 2001',
        genre: {
            name: 'Action',
            description: 'I\'m going on an Adventure - Bilbo Baggins'
        },
        director: {
            name: 'Peter Jackson',
            birthdate: 'October 31, 1961',
            bio: 'Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously'
        },
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'
    }
];

// USER orientated URL requests below ------------------- 

// allow new users to register POST/ CREATE

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send("users need names")
    }
})

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