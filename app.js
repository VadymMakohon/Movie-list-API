document.addEventListener('DOMContentLoaded', () => {
    const movieInput = document.getElementById('movieInput');
    const addMovieBtn = document.getElementById('addMovieBtn');
    const movieList = document.getElementById('movieList');
    const apiKey = 'YOUR_OMDB_API_KEY'; // Replace with your OMDB API key

    // Load movies from local storage
    const loadMovies = () => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.forEach(movie => addMovieToDOM(movie));
    };

    // Fetch movie details from OMDB API
    const fetchMovieDetails = async (title) => {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
        const data = await response.json();
        return data;
    };

    // Add movie to DOM
    const addMovieToDOM = (movie) => {
        const li = document.createElement('li');

        const img = document.createElement('img');
        img.src = movie.poster;
        img.alt = movie.title;

        const span = document.createElement('span');
        span.textContent = movie.title;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('removeBtn');
        removeBtn.addEventListener('click', () => removeMovie(movie.title));

        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(removeBtn);
        movieList.appendChild(li);
    };

    // Add movie to list and local storage
    const addMovie = async () => {
        const title = movieInput.value.trim();
        if (title) {
            const movieDetails = await fetchMovieDetails(title);
            if (movieDetails.Response === "True") {
                const movie = {
                    title: movieDetails.Title,
                    poster: movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'default-poster.jpg' // Fallback to a default poster if none found
                };
                addMovieToDOM(movie);
                saveMovie(movie);
                movieInput.value = '';
            } else {
                alert('Movie not found!');
            }
        }
    };

    // Save movie to local storage
    const saveMovie = (movie) => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.push(movie);
        localStorage.setItem('movies', JSON.stringify(movies));
    };

    // Remove movie from list and local storage
    const removeMovie = (title) => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const updatedMovies = movies.filter(m => m.title !== title);
        localStorage.setItem('movies', JSON.stringify(updatedMovies));
        movieList.innerHTML = '';
        loadMovies();
    };

    // Event listeners
    addMovieBtn.addEventListener('click', addMovie);
    movieInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addMovie();
        }
    });

    // Initial load
    loadMovies();
});
