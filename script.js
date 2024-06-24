const apiKey = "bb154274";

// Function to search for movies
async function searchMovies(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
  );
  const data = await response.json();
  return data.Search || [];
}

// Function to add a movie to favourites
async function addToFavourites(event) {
  const imdbID = event.target.dataset.imdbid;// Extract IMDb ID from the event target's dataset
  const movie = await getMovieDetails(imdbID);// Fetch movie details using the IMDb ID
  // Check if movie details are successfully fetched
  if (movie) {
     // Retrieve current favourites list from localStorage or initialize as empty array
    const favouritesList = JSON.parse(localStorage.getItem("favourites")) || [];
    // Check if the movie is not already in the favourites list
    if (!favouritesList.some((m) => m.imdbID === movie.imdbID)) { 
      favouritesList.push(movie);
        // Update localStorage with the updated favourites list
      localStorage.setItem("favourites", JSON.stringify(favouritesList));
       // Notify user that the movie has been added to favourites
      alert(`${movie.Title} has been added to your favourites!`);
    } else {
      alert(`${movie.Title} is already in your favourites!`);
    }
  }
}

// Function to display search results on the index.html page
function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";
    // Iterate over each movie object in the results array
  results.forEach((movie) => {
    const movieCard = document.createElement("div");  // Create a new <div> element for each movie (card layout)
    movieCard.classList.add("card", "col-md-4", "mb-4");   // Add Bootstrap classes to style the card
     // Set inner HTML of the movie card with movie details
    movieCard.innerHTML = `
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <button class="btn btn-primary btn-sm favourite-button" data-imdbid="${movie.imdbID}">Add to Favourites</button>
                <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary btn-sm more-button">More</a>
            </div>
        `;
    searchResultsContainer.appendChild(movieCard);// Append the movie card to the search results container
  });
 // Select all elements with class "favourite-button" (created in each movie card)
  const favouriteButtons = document.querySelectorAll(".favourite-button");
   // Attach event listener to each favourite button
  favouriteButtons.forEach((button) => {
    button.addEventListener("click", addToFavourites);
  });
}

// Event listener for the Search Button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
  const query = document.getElementById("searchInput").value.trim();
  if (query.length > 0) {
    searchMovies(query)
      .then((results) => {
        displaySearchResults(results);
        // Store the search results in LocalStorage
        localStorage.setItem("searchResults", JSON.stringify(results));
      })
      .catch((error) => console.error("Error searching movies:", error));
  }
});

// Function to get movie details by IMDb ID
async function getMovieDetails(imdbID) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
  );
  const data = await response.json();
  return data.Response === "True" ? data : null;
}

// Automatically display search results if available from previous search
const previousSearchResults = JSON.parse(localStorage.getItem("searchResults"));
if (previousSearchResults && previousSearchResults.length > 0) {
  displaySearchResults(previousSearchResults);
}

const quoteText = document.getElementById("quoteText");
const quoteSpeed = 200; // Time (in milliseconds) for each word to appear
const movieQuotations = [
  "Wakanda forever! - Black Panther",
  "I love you 3000. - Avengers: Endgame",
  "I'm Mary Poppins, y'all! - Guardians of the Galaxy Vol. 2",
  "The hardest choices require the strongest wills. - Avengers: Infinity War",
  "We are Groot. - Guardians of the Galaxy",
  "You are a toy! - Toy Story 4",
  "To infinity and beyond! - Toy Story 4",
  "No one is ever really gone. - Star Wars: The Rise of Skywalker",
  "You're breathtaking! - Cyberpunk 2077 E3",
  "I am inevitable. - Avengers: Endgame",
];
let currentQuoteIndex = 0;

// Function to display the quotation word by word
async function displayQuoteWordByWord() {
  const quote = movieQuotations[currentQuoteIndex];
  const words = quote.split(" ");

  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, quoteSpeed));
    quoteText.textContent = words.slice(0, i + 1).join(" ");
  }

  // After displaying all words, wait for 1 second and then show the next quote
  await new Promise((resolve) => setTimeout(resolve, 800));
  showNextQuote();
}

// Function to show the next quotation
function showNextQuote() {
  currentQuoteIndex = (currentQuoteIndex + 1) % movieQuotations.length;
  displayQuoteWordByWord();
}

// Display the first quotation on page load
displayQuoteWordByWord();
