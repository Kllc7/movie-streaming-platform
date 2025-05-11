document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    let currentUser = null;
    
    // Fetch and display movies in the movie grid
    const fetchMovies = async () => {
        try {
            console.log('Fetching movies...');
            const response = await fetch('/api/movies');
            console.log('Response received:', response.status);
            const movies = await response.json();
            console.log('Movies data:', movies);
            displayMovies(movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
            showError('Unable to load movies. Please try again later.');
        }
    };

    const displayMovies = (movies) => {
        console.log('Displaying movies...');
        const movieGrid = document.getElementById('movieGrid');
        if (!movieGrid) {
            console.error('Movie grid element not found');
            return;
        }

        movieGrid.innerHTML = movies.map(movie => `
            <div class="movie-card group cursor-pointer" data-movie-id="${movie.id}">
                <div class="relative overflow-hidden rounded-lg">
                    <!-- Movie Thumbnail -->
                    <img src="${movie.thumbnail}" 
                         alt="${movie.title}" 
                         class="w-full h-[300px] object-cover transform group-hover:scale-105 transition duration-300">
                    
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-semibold">${movie.title}</h3>
                            <span class="text-yellow-400">★ ${movie.rating}</span>
                        </div>
                        <p class="text-sm text-gray-300 mb-2">${movie.description}</p>
                        <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>${movie.year}</span>
                            <span>${movie.duration}</span>
                            <span>${movie.genre}</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="window.location.href='/views/moviePlayer.html?id=${movie.id}'"
                                    class="flex-1 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition">
                                Watch Now
                            </button>
                            <button onclick="addToWatchlist(${movie.id})"
                                    class="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        console.log('Movies displayed successfully');
    };

    // Search functionality
    const searchMovies = async (query) => {
        try {
            const response = await fetch(`/api/movies/search/${encodeURIComponent(query)}`);
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error('Error searching movies:', error);
            showError('Error searching movies. Please try again.');
        }
    };

    const searchInput = document.querySelector('input[placeholder="Search movies..."]');
    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    searchMovies(searchTerm);
                } else {
                    fetchMovies();
                }
            }, 300);
        });
    }

    // Filter by genre
    const filterByGenre = async (genre) => {
        try {
            const response = await fetch(`/api/movies/genre/${encodeURIComponent(genre)}`);
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error('Error filtering movies:', error);
            showError('Error filtering movies. Please try again.');
        }
    };

    // Add click handlers for category cards
    document.querySelectorAll('.bg-gray-800.rounded-lg').forEach(card => {
        card.addEventListener('click', () => {
            const genre = card.querySelector('h4').textContent;
            filterByGenre(genre);
        });
    });

    // Watchlist functionality
    window.addToWatchlist = async (movieId) => {
        if (!currentUser) {
            window.location.href = '/views/login.html';
            return;
        }

        try {
            const response = await fetch(`/api/watchlist/${currentUser.id}/add/${movieId}`, {
                method: 'POST'
            });
            const data = await response.json();
            showNotification('Movie added to watchlist');
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            showError('Error adding to watchlist. Please try again.');
        }
    };

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (response.ok) {
                    currentUser = data.user;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    window.location.href = '/views/index.html';
                } else {
                    showError(data.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Login failed. Please try again.');
            }
        });
    }

    // Utility functions
    const showError = (message) => {
        // You can implement a better error notification system
        alert(message);
    };

    const showNotification = (message) => {
        // You can implement a better notification system
        alert(message);
    };

    // Check for logged in user
    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            currentUser = JSON.parse(userData);
            updateUIForLoggedInUser();
        }
    };

    const updateUIForLoggedInUser = () => {
        const signInButton = document.querySelector('a[href="/views/login.html"]');
        if (signInButton) {
            signInButton.textContent = 'My Account';
            signInButton.href = '#';
        }
    };

    // Initialize the page
    console.log('Initializing page...');
    checkAuth();
    fetchMovies();

    // Handle mobile menu toggle
    const mobileMenuBtn = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-items]');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
