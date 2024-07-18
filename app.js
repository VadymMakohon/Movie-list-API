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
        if (data.results && data.results.length > 0) {
            const movieData = data.results[0];
            const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieData.id}?api_key=${apiKey}`);
            const movieDetails = await movieDetailsResponse.json();
            return {
                title: movieData.title,
                poster: movieData.poster_path ? movieData.poster_path : '/default-poster.jpg', // Fallback to a default poster if none found
                releaseDate: movieData.release_date,
                director: movieDetails.credits.crew.find(member => member.job === 'Director')?.name || 'Unknown',
                genre: movieDetails.genres.map(genre => genre.name).join(', ')
            };
        } else {
            return null;
        }
    };

    // Add movie to DOM
    const addMovieToDOM = (movie) => {
        const li = document.createElement('li');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster}`;
        img.alt = movie.title;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('movie-details');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = `Title: ${movie.title}`;

        const releaseDateSpan = document.createElement('span');
        releaseDateSpan.textContent = `Release Date: ${movie.releaseDate}`;

        const directorSpan = document.createElement('span');
        directorSpan.textContent = `Director: ${movie.director}`;

        const genreSpan = document.createElement('span');
        genreSpan.textContent = `Genre: ${movie.genre}`;

        detailsDiv.appendChild(titleSpan);
        detailsDiv.appendChild(releaseDateSpan);
        detailsDiv.appendChild(directorSpan);
        detailsDiv.appendChild(genreSpan);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('removeBtn');
        removeBtn.addEventListener('click', () => removeMovie(movie.title));

        li.appendChild(img);
        li.appendChild(detailsDiv);
        li.appendChild(removeBtn);
        movieList.appendChild(li);
    };

    // Add movie to list and local storage
    const addMovie = async () => {
        const title = movieInput.value.trim();
        if (title) {
            const movie = await fetchMovieDetails(title);
            if (movie) {
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