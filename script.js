const searchInput = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const placeHolder = document.querySelector('.placeholder')
const moviesContainer = document.querySelector('.movies-container')
const apiKey = 'a55ae57'

searchBtn.addEventListener('click', fetchData)

moviesContainer.addEventListener('click', (event) => {
  const watchlistButton = event.target.closest('.add-to-watchlist')
  if (watchlistButton) {
    console.log(watchlistButton.dataset.movieId)
  }
})

function fetchData() {
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

    let movieInfoHtml = ""

    data.Search.forEach((movie) => {
      
      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
        .then(res => res.json())
        .then(data => {
          movieInfoHtml = `
          <div class="movie-container">
            <div class="movie-img-wrapper">
              <img class="movie-img" src="${data.Poster}" alt="${data.Title} movie poster">
            </div>
            <div id="movie-data" class="movie-data">
              <div class="movie-title">${data.Title} <span class="movie-rating">⭐ ${data.imdbRating}</span></div>
              <div class="movie-stats">
                <div class="movie-run-time">${data.Runtime}</div>
                <div class="movie-genre">${data.Genre}</div>
                <button class="add-to-watchlist" data-movie-id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i> watchlist</button>
              </div>
              <div class="movie-plot"><p>${data.Plot}</p></div>
            </div>
          </div>
          `
          moviesContainer.innerHTML += movieInfoHtml
        })
    })
    
  } else {
    placeHolder.innerHTML = 
      `<p class="not-found">There was an error processing your search.
      Please try again.</p>`
  }
}