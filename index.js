const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let movies = [
    {
        title: 'Iron Man',
        release_date: 'May 2, 2008'
    },
    {
        title: 'The Incredible Hulk',
        release_date: 'June 13, 2008'
    },
    {
        title: 'Iron Man 2',
        release_date: 'May 7, 2010'
    },
    {
        title: 'Thor',
        release_date: 'May 6, 2011'
    },
    {
        title: 'Captain America: The First Avenger',
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