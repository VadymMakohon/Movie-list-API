document.addEventListener('DOMContentLoaded', () => {
    const movieInput = document.getElementById('movieInput');
    const addMovieBtn = document.getElementById('addMovieBtn');
    const movieList = document.getElementById('movieList');

    // Load movies from local storage
    const loadMovies = () => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.forEach(movie => addMovieToDOM(movie));
    };

    // Add movie to DOM
    const addMovieToDOM = (movie) => {
        const li = document.createElement('li');
        li.textContent = movie;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('removeBtn');
        removeBtn.addEventListener('click', () => removeMovie(movie));
        li.appendChild(removeBtn);
        movieList.appendChild(li);
    };

    // Add movie to list and local storage
    const addMovie = () => {
        const movie = movieInput.value.trim();
        if (movie) {
            addMovieToDOM(movie);
            saveMovie(movie);
            movieInput.value = '';
        }
    };

    // Save movie to local storage
    const saveMovie = (movie) => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.push(movie);
        localStorage.setItem('movies', JSON.stringify(movies));
    };

    // Remove movie from list and local storage
    const removeMovie = (movie) => {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const updatedMovies = movies.filter(m => m !== movie);
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
