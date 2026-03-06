const placeHolder = document.querySelector('.placeholder')
const moviesContainer = document.querySelector('.movies-container')
const searchInput = document.getElementById('search')
const posterPlaceholder = "/images/poster-placeholder.png"
const apiKey = 'a55ae57'
let movieData = []

if (document.body.classList.contains('home')) {
  const searchBtn = document.getElementById('search-btn')
  searchBtn.addEventListener('click', fetchData)
}

if (document.body.classList.contains('watchlist')) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist'))
  if (watchlist && watchlist.length > 0) {
    placeHolder.classList.add('hidden')
    moviesContainer.classList.remove('hidden')
    watchlist.forEach(movie => {
      movieData.push(movie)
      renderHtml(movie)
    })
  }
}

moviesContainer.addEventListener('click', (event) => {
  const addToWatchlistButton = event.target.closest('.add-to-watchlist')
  const removeFromWatchlistButton = event.target.closest('.remove-from-watchlist')
  // Add to watchlist event listener
  if (addToWatchlistButton) {
    const chosenMovie = movieData.find(movie => movie.imdbID === addToWatchlistButton.dataset.movieId)
    addToWatchlistButton.innerHTML = '<i class="fa-solid fa-check"></i> Added'
    addToWatchlist(chosenMovie)
  }
  // Remove from watchlist event listener
  if (removeFromWatchlistButton) {
    const chosenMovie = movieData.find(movie => movie.imdbID === removeFromWatchlistButton.dataset.movieId)
    removeFromWatchlistButton.innerHTML = '<i class="fa-solid fa-check"></i> Removed'
    console.log(chosenMovie)
    removeFromWatchlist(chosenMovie)
  }
})

function fetchData(e) {
  e.preventDefault()
  movieData = []
  moviesContainer.innerHTML = ""
  placeHolder.classList.remove('hidden')
  moviesContainer.classList.add('hidden')
  placeHolder.innerHTML = `<p class="searching-placeholder">Searching...</p>`

  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput.value}&type=movie`)
    .then(res => res.json())
    .then(data => displayData(data))
}

function displayData(data) {
  if (data.Response === "False") {
    placeHolder.innerHTML = 
      `<p class="not-found">Unable to find what you're looking for.
      Please try another search.</p>`
  } else if (data.Response === "True") {
    placeHolder.classList.add('hidden')
    moviesContainer.classList.remove('hidden')

    data.Search.forEach((movie) => {
      
      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
        .then(res => res.json())
        .then(data => {
          movieData.push(data)
          renderHtml(data)
        })
    })
    
  } else {
    placeHolder.innerHTML = 
      `<p class="not-found">There was an error processing your search.
      Please try again.</p>`
  }
}

function renderHtml(data) {
  let watchlistHtml = `<button class="add-to-watchlist" data-movie-id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>` 
  if (checkIsInWatchlist(data)) {
    watchlistHtml = `<button class="remove-from-watchlist" data-movie-id="${data.imdbID}"><i class="fa-solid fa-circle-minus"></i> Remove</button>`
  }

  let moviePoster = data.Poster
  if (moviePoster === "N/A" || !moviePoster) {
    moviePoster = posterPlaceholder
  }

  let moviePlot = data.Plot 
  if (moviePlot === "N/A" || !moviePlot) {
    moviePlot = "Movie summary not found."
  }

  const movieInfoHtml = `
    <div class="movie-container">
      <div class="movie-img-wrapper">
        <img class="movie-img" src="${moviePoster}" alt="${data.Title} movie poster">
      </div>
      <div id="movie-data" class="movie-data">
        <div class="movie-title">${data.Title} <span class="movie-rating">⭐ ${data.imdbRating}</span></div>
        <div class="movie-stats">
          <div class="movie-year">${data.Year}</div>
          <div class="movie-run-time">${data.Runtime}</div>
          <div class="movie-genre">${data.Genre}</div>
          ${watchlistHtml}
        </div>
        <div class="movie-plot"><p>${moviePlot}</p></div>
      </div>
    </div>
    `
  moviesContainer.innerHTML += movieInfoHtml
}

function checkIsInWatchlist(data) {
  if (!localStorage.getItem("watchlist")) {
    return false
  } else {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    let exists = false
    watchlist.forEach(mov => mov.imdbID === data.imdbID ? exists = true : null)
    return exists
  }
}

function addToWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
  let alreadyExists = false
  watchlist.forEach(mov => mov.imdbID === movie.imdbID ? alreadyExists = true : null)
  if (!alreadyExists) {
    watchlist.push(movie)
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }
  console.log(watchlist)
}

function removeFromWatchlist(movie) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"))
  let index
  watchlist.forEach((mov,i) => mov.imdbID === movie.imdbID ? index = i : null)
  watchlist.splice(index, 1)
  localStorage.setItem("watchlist", JSON.stringify(watchlist))
}