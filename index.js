const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

// define users array
let users = [
    {
        id: 1,
        userName: 'filmlover69',
        faveMovies: []
    },
    {
        id: 2,
        userName: 'McLovin',
        faveMovies: ['Superbad']
    }
]


let movies = [
    {
        title: 'Iron Man',
        release_date: 'May 2, 2008'
    },
    {
        title: 'Superbad',
        release_date: 'June 13, 2008'
    },
    {
        title: 'Scary Movie',
        release_date: 'May 7, 2010'
    },
    {
        title: 'American Psycho',
        release_date: 'May 6, 2011',
        genre: {
            name: 'Horror',
            description: 'Insert description here'
        },
        director: {
            name: 'Mary Harron',
            bio: 'Mary Harron (born January 12, 1953) is a Canadian filmmaker and screenwriter. She gained recognition for her role in writing and directing several independent films, including I Shot Andy Warhol (1996), American Psycho (2000), and The Notorious Bettie Page (2005)'
        }
    },
    {
        title: '',
        release_date: 'July 22, 2011'
    },
    {
        title: 'The Avengers',
        release_date: 'May 4, 2012'
    }
];

// USE requests

app.use(express.static('public'));
app.use(morgan('common'));

// GET requests

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res) => {
    res.send("If you're looking for movies, you've come to the right place");
});












//ERROR handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, it looks like there was a glitch in the Matrix!');
  });

// LISTEN
app.listen(8080, () =>{
    console.log('Your app is listening on port 8080.');
  });