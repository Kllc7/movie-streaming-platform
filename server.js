const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static assets from /public
app.use('/', express.static(path.join(__dirname, 'public')));

// Sample user data (in a real app, this would be in a database)
const users = [
    { id: 1, email: 'test@example.com', password: 'password123' }
];

// Sample movie data (in a real app, this would be in a database)
const movies = [
    {
        id: 1,
        title: "The Adventure Begins",
        thumbnail: "https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg",
        description: "An epic journey through unknown territories.",
        genre: "Adventure",
        rating: 4.5,
        year: 2024,
        duration: "2h 15m",
        cast: ["John Doe", "Jane Smith"],
        director: "Robert Johnson",
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 2,
        title: "City Lights",
        thumbnail: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
        description: "A story of love and dreams in the big city.",
        genre: "Drama",
        rating: 4.8,
        year: 2024,
        duration: "1h 55m",
        cast: ["Michael Brown", "Sarah Davis"],
        director: "Emily Wilson",
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 3,
        title: "Ocean's Mystery",
        thumbnail: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg",
        description: "Discover the secrets beneath the waves.",
        genre: "Mystery",
        rating: 4.3,
        year: 2024,
        duration: "2h 10m",
        cast: ["David Clark", "Emma White"],
        director: "James Anderson",
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 4,
        title: "Mountain Peak",
        thumbnail: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
        description: "A thrilling climb to the top of the world.",
        genre: "Adventure",
        rating: 4.6,
        year: 2024,
        duration: "1h 45m",
        cast: ["Tom Wilson", "Lisa Moore"],
        director: "Christopher Lee",
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
];

// API Endpoints

// Get all movies
app.get('/api/movies', (req, res) => {
    try {
        console.log('Sending movies data');
        res.json(movies);
    } catch (err) {
        console.error('Error retrieving movies:', err);
        res.status(500).send('Server error');
    }
});

// Get movie by ID
app.get('/api/movies/:id', (req, res) => {
    try {
        const movie = movies.find(m => m.id === parseInt(req.params.id));
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        console.error('Error retrieving movie:', err);
        res.status(500).send('Server error');
    }
});

// Search movies
app.get('/api/movies/search/:query', (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        const results = movies.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            movie.description.toLowerCase().includes(query)
        );
        res.json(results);
    } catch (err) {
        console.error('Error searching movies:', err);
        res.status(500).send('Server error');
    }
});

// Get movies by genre
app.get('/api/movies/genre/:genre', (req, res) => {
    try {
        const genre = req.params.genre;
        const results = movies.filter(movie => 
            movie.genre.toLowerCase() === genre.toLowerCase()
        );
        res.json(results);
    } catch (err) {
        console.error('Error retrieving movies by genre:', err);
        res.status(500).send('Server error');
    }
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In a real app, you would generate and send a JWT token here
        res.json({ 
            message: 'Login successful',
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});

// User watchlist endpoints
const watchlists = new Map(); // In a real app, this would be in a database

// Add movie to watchlist
app.post('/api/watchlist/:userId/add/:movieId', (req, res) => {
    try {
        const { userId, movieId } = req.params;
        if (!watchlists.has(userId)) {
            watchlists.set(userId, new Set());
        }
        watchlists.get(userId).add(parseInt(movieId));
        res.json({ message: 'Movie added to watchlist' });
    } catch (err) {
        console.error('Error adding to watchlist:', err);
        res.status(500).send('Server error');
    }
});

// Get user's watchlist
app.get('/api/watchlist/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userWatchlist = watchlists.get(userId);
        if (!userWatchlist) {
            return res.json([]);
        }
        const watchlistMovies = Array.from(userWatchlist).map(movieId => 
            movies.find(m => m.id === movieId)
        ).filter(Boolean);
        res.json(watchlistMovies);
    } catch (err) {
        console.error('Error retrieving watchlist:', err);
        res.status(500).send('Server error');
    }
});

// Remove movie from watchlist
app.delete('/api/watchlist/:userId/remove/:movieId', (req, res) => {
    try {
        const { userId, movieId } = req.params;
        const userWatchlist = watchlists.get(userId);
        if (userWatchlist) {
            userWatchlist.delete(parseInt(movieId));
        }
        res.json({ message: 'Movie removed from watchlist' });
    } catch (err) {
        console.error('Error removing from watchlist:', err);
        res.status(500).send('Server error');
    }
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Fallback for 404 errors
app.use((req, res, next) => {
    console.log('404 error for:', req.url);
    res.status(404).sendFile(path.join(__dirname, 'public', 'views', 'error.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).send('Server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Static files being served from: ${path.join(__dirname, 'public')}`);
});
