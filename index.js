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
        userName: 'Hansel-so-hot-right-now',
        faveMovies: ['Zoolander']
    }
]


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