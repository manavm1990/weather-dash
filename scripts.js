import { addCity2Storage, fetchWeather } from './api.js';

const current = document.querySelector('#current');
const history = document.querySelector('#history');

function createCityDateHeading(city) {
  const h2 = document.createElement('h2');
  const now = new Date(Date.now());

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${city} (${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()})`;

  return h2;
}

function renderCurrentHeading(heading, icon) {
  // ⚠️ Don't try to compose `appendChild` 🤷🏾‍♂️
  heading.appendChild(icon);
  current.appendChild(heading);
}

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

function createIcon(weatherInfo) {
  const span = document.createElement('span');

  span.innerHTML = `<img src="https://openweathermap.org/img/w/${
    weatherInfo.icon
  }.png" alt="${weatherInfo.description || weatherInfo.main}" />`;

  return span;
}

// TODO: Move this to api.js

function renderCurrentWeather(currentWeather) {
  const ul = document.createElement('ul');

  ul.innerHTML = `
    <li>Temp: ${currentWeather.temp}°F</li>
    <li>Wind: ${currentWeather.wind_speed} MPH</li>
    <li>Humidity: ${currentWeather.humidity} %</li>
    <li>UV Index ${renderUVI(currentWeather.uvi)}</li>
  `;

  current.appendChild(ul);
}

function renderUVI(uvIndex) {
  let className;

  if (uvIndex < 3) {
    className = 'bg-success';
  } else if (uvIndex < 7) {
    className = 'bg-warning';
  } else {
    className = 'bg-danger';
  }

  return `<span class="badge rounded-pill ${className}">${uvIndex}</span>`;
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;
  const forecast = await fetchWeather(city);

  addCity2Storage(city);
  const currentHeading = createCityDateHeading(city);
  const iconSpan = createIcon(forecast.current.weather[0]);

  renderCurrentHeading(currentHeading, iconSpan);
  renderCurrentWeather(forecast.current);
  // RenderForecast(forecast);
  // renderHistoryButtons();
});

// Bubbling 🧋
// document.querySelector('#history').addEventListener('click', async event => {
//   const city = event.target.innerText;
//   const weather = await fetchCurrentWeather(city);
//   renderCurrent(weather);
// });

renderHistoryButtons();
