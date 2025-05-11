
Built by KLLC

---

# Movie Streaming Platform

A modern movie streaming platform featuring a custom video player and RESTful APIs for movie browsing, user authentication, and managing watchlists.

## Project Overview

The Movie Streaming Platform is designed to provide users with an engaging interface for discovering and watching movies. It includes features for searching, filtering by genres, and managing user watchlists. Built with Express.js, this platform offers a flexible API that can be expanded with additional features as required.

## Installation

To set up the project locally, follow these instructions:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/movie-streaming-platform.git
   cd movie-streaming-platform
   ```

2. **Install dependencies:**

   Ensure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

3. **Start the server:**

   You can run the application in development mode using:

   ```bash
   npm run dev
   ```

   Or to start the production server:

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:8000`.

## Usage

Once the server is running, you can interact with the API through the following endpoints:

- **Get all movies:**  
  `GET /api/movies`  
  Returns a list of all available movies.

- **Get movie by ID:**  
  `GET /api/movies/:id`  
  Returns details of a specific movie based on ID.

- **Search for movies:**  
  `GET /api/movies/search/:query`  
  Returns a list of movies matching the search query.

- **Get movies by genre:**  
  `GET /api/movies/genre/:genre`  
  Returns a list of movies filtered by genre.

- **User authentication:**  
  `POST /api/auth/login`  
  Validates user credentials and returns a success message.

- **Manage watchlists:**  
  - *Add a movie:*  
    `POST /api/watchlist/:userId/add/:movieId`
  - *Get watchlist:*  
    `GET /api/watchlist/:userId`
  - *Remove movie from watchlist:*  
    `DELETE /api/watchlist/:userId/remove/:movieId`

## Features

- Browse and search through a variety of movies.
- User authentication for personalized experiences.
- Manage a watchlist to keep track of movies of interest.
- Sample movie and user data for testing.

## Dependencies

The project includes the following dependencies, as specified in `package.json`:

- **Express:** ^4.21.2  
  A web framework for Node.js that helps in building APIs and web applications.

## Project Structure

The following outlines the main structure of the project:

```
movie-streaming-platform/
├── package.json           # Contains project metadata and dependencies
├── package-lock.json      # Locks dependencies to specific versions
├── server.js              # Main server file with API route handling
└── public/                # Static assets (HTML, CSS, JavaScript, etc.)
    ├── views/             # Contains HTML views like index.html and error.html
```

## License

This project is licensed under the MIT License.

---

Feel free to modify the project or contribute by submitting pull requests or issues!
