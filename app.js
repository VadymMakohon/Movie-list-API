document.addEventListener('DOMContentLoaded', () => {
    const movieInput = document.getElementById('movieInput');
    const addMovieBtn = document.getElementById('addMovieBtn');
    const movieList = document.getElementById('movieList');
    const apiKey = 'df0d8322142028c805b9dfd293d92ac6'; // Replace with your TMDb API key

    // Load movies from local storage
    const loadMovies = () => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.forEach(movie => addMovieToDOM(movie));
    };

    // Fetch movie details from TMDb API
    const fetchMovieDetails = async (title) => {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
        const data = await response.json();
        return data;
    };

    // Add movie to DOM
    const addMovieToDOM = (movie) => {
        const li = document.createElement('li');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster}`;
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
            if (movieDetails.results && movieDetails.results.length > 0) {
                const movieData = movieDetails.results[0];
                const movie = {
                    title: movieData.title,
                    poster: movieData.poster_path ? movieData.poster_path : '/default-poster.jpg' // Fallback to a default poster if none found
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
