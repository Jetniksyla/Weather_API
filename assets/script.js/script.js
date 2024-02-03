// Selecting DOM elements for interaction
const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeather = document.querySelector(".current-weather");
const exploreButtons = document.querySelectorAll(".explore-section");

// OpenWeatherMap API key for accessing weather data
const API_KEY = "723679d5a3a7de9c4bebc13008166bdd";

// Function to fetch weather data and update the page
const updateWeatherData = (cityName, lat, lon) => {
  const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(Weather_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Filtering unique forecast days for the 5-day forecast
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Formatting current date for display
      const currentDate = new Date();
      const currentDateFormatted = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      // Extracting current weather information
      const currentWeatherInfo = data.list[0];
      const date = new Date(currentWeatherInfo.dt * 1000);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      currentWeather.innerHTML = `
  <div class="details">
    <h2>${cityName}</h2>
    <h3>${currentDateFormatted}</h3>
    <h4>Temperature: ${(currentWeatherInfo.main.temp - 273.16).toFixed(
      2
    )} C°</h4>
    <h4>Wind: ${currentWeatherInfo.wind.speed} M/S</h4>
    <h4>Humidity: ${currentWeatherInfo.main.humidity}%</h4>
  </div>
  <div class="icon">
    <img src="https://openweathermap.org/img/wn/${
      currentWeatherInfo.weather[0].icon
    }@4x.png" alt="${currentWeatherInfo.weather[0].description}" />
    <h4>${currentWeatherInfo.weather[0].description}</h4>
  </div>
      `;

      // Clear previous forecast cards
      weatherCardsDiv.innerHTML = "";

      // Display 5-day forecast cards
      fiveDaysForecast.forEach((weatherItem) => {
        weatherCardsDiv.insertAdjacentHTML(
          "beforeend",
          createWeatherCard(weatherItem)
        );
      });
    })
    .catch((error) => {
      alert(error);
    });
};

// Function to handle click events for explore buttons
const handleExploreButtonClick = (event) => {
  const cityName = event.target.textContent;
  const Geocoding_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(Geocoding_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon } = data[0];
      updateWeatherData(cityName, lat, lon);
    })
    .catch((error) => {
      alert(error);
    });
};

// Add click event listeners to each explore button
exploreButtons.forEach((button) => {
  button.addEventListener("click", handleExploreButtonClick);
});

// Function to create weather card
const createWeatherCard = (weatherItem) => {
  return `
    <li class="card">
      <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
      <img src="https://openweathermap.org/img/wn/${
        weatherItem.weather[0].icon
      }@4x.png" alt="weather-icon">
      <br>
      <h4>Temp: ${(weatherItem.main.temp - 273.16).toFixed(2)} C°</h4>
      <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
      <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;
};

// Function to get weather data for the entered city
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const Geocoding_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(Geocoding_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon } = data[0];
      updateWeatherData(cityName, lat, lon);
    })
    .catch((error) => {
      alert(error);
    });
};

// Add click event listener for the search button
searchButton.addEventListener("click", getCityCoordinates);

function addCity() {
  var cityInput = document.querySelector(".city-input");
  var cityName = cityInput.value;

  if (cityName.trim() !== "") {
    var listItem = document.createElement("div");
    listItem.classList.add("city-item");
    listItem.textContent = cityName;

    var exploreSection = document.querySelector(".explore-section");
    exploreSection.appendChild(listItem);

    cityInput.value = "";
  }
}

// Attach the addCity function to the click event of the search button
document.querySelector(".search-btn").addEventListener("click", addCity);
