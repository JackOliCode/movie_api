const express = require('express'),
    morgan = require('morgan');

const app = express();  

let topMovies = [
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

// GET requests
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send("If you're looking for movies, you've come to the right place");
});