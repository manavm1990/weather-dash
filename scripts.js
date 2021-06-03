import {
  addCity2Storage,
  createCityDateHeading,
  createIcon,
  fetchWeather,
} from './lib.js';

const current = document.querySelector('#current');
const history = document.querySelector('#history');

function renderCurrent(city, currentForecast) {
  current.innerHTML = '';
  const currentHeading = createCityDateHeading(city);
  const iconSpan = createIcon(currentForecast.weather[0]);

  renderCurrentHeading(currentHeading, iconSpan);
  renderCurrentWeather(currentForecast);
}

function renderCurrentHeading(heading, icon) {
  // ⚠️ Don't try to compose `appendChild` 🤷🏾‍♂️
  heading.appendChild(icon);
  current.appendChild(heading);
}

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

  renderCurrent(city, forecast.current);
  addCity2Storage(city);
  renderHistoryButtons();
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const city = event.target.innerText;
  const forecast = await fetchWeather(city);

  renderCurrent(city, forecast.current);
});

renderHistoryButtons();
