import { addCity2Storage, fetchCurrentWeather, fetchForecast } from './api.js';

const current = document.querySelector('#current');
const history = document.querySelector('#history');

async function fetchWeather(city) {
  const ret = {};

  return fetchCurrentWeather(city)
    .then(currentWeather => {
      ret.currentWeather = currentWeather;
      return { lat: currentWeather.coord.lat, lon: currentWeather.coord.lon };
    })
    .then(({ lat, lon }) => fetchForecast(lat, lon))
    .then(forecast => {
      ret.forecast = forecast;
      return ret;
    })
    .then(ret => ret);
}

function renderIcon(weatherInfo) {
  const span = document.createElement('span');

  const [weather] = weatherInfo.weather;
  span.innerHTML = `<img src="https://openweathermap.org/img/w/${
    weather.icon
  }.png" alt="${weather.description || weather.main}" />`;

  return span;
}

function renderCurrent(weatherData) {
  const h2 = document.createElement('h2');

  const now = new Date(Date.now());

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${weatherData.name} (${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()})`;

  current.innerHTML = '';
  current.appendChild(h2);
  h2.appendChild(renderIcon(weatherData));
  renderCurrentDetails(weatherData);
}

function renderCurrentDetails(weather) {
  const ul = document.createElement('ul');

  ul.innerHTML = `
    <li>Temp: ${weather.main.temp}°F</li>
    <li>Wind: ${weather.wind.speed} MPH</li>
    <li>Humidity: ${weather.main.humidity} %</li>
    <li>UV Index</li>
  `;

  current.appendChild(ul);
}

function renderForecast(forecast) {}

function renderHistoryButton(city) {
  history.innerHTML += `<li class="list-group-item text-center"><button class="bg-secondary text-light">${city}</button></li>`;
}

function renderHistoryButtons() {
  history.innerHTML = '';

  const searchHistory = localStorage.getItem('searchHistory');

  if (searchHistory) {
    JSON.parse(searchHistory).forEach(city => {
      renderHistoryButton(city);
    });
  }
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;
  const { currentWeather, forecast } = await fetchWeather(city);

  addCity2Storage(city);
  renderCurrent(currentWeather);
  renderForecast(forecast);
  renderHistoryButtons();
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const city = event.target.innerText;
  const weather = await fetchCurrentWeather(city);
  renderCurrent(weather);
});

renderHistoryButtons();
