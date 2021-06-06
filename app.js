/* global luxon */
import config from './config.js';
import dom from './dom.js';
import { capitalizeEachWord } from './utils.js';

function addCity2Storage(city) {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(capitalizeEachWord(city))) {
    localStorage.setItem(
      'searchHistory',
      JSON.stringify([...searchHistory, capitalizeEachWord(city)]),
    );
  }
}

function createCityDateHeading(city, timezone) {
  const h2 = document.createElement('h2');

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${city} (${luxon.DateTime.local()
    .setZone(timezone)
    .endOf('day')
    .toLocaleString()})`;

  return h2;
}

function createIcon(weatherInfo) {
  const span = document.createElement('span');

  span.innerHTML = `<img src="https://openweathermap.org/img/w/${
    weatherInfo.icon
  }.png" alt="${weatherInfo.description || weatherInfo.main}" />`;

  return span;
}

async function fetchCoord(city) {
  const data = await fetch(
    `${config.WEATHER_URL}?q=${city}&appid=${config.API_KEY}`,
  );

  const { coord } = await data.json();
  return coord;
}

async function fetchForecast(lat, lon) {
  const data = await fetch(
    `${config.FORECAST_URL}?&appid=${config.API_KEY}&lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial`,
  );

  return data.json();
}

function fetchWeather(city) {
  return fetchCoord(city)
    .then(coords => coords)
    .then(({ lat, lon }) => fetchForecast(lat, lon));
}

function renderCurrentHeading(heading, icon) {
  // ⚠️ Don't try to compose `appendChild` 🤷🏾‍♂️
  heading.appendChild(icon);
  dom.current.appendChild(heading);
}

function renderCurrentWeather(currentWeather) {
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');

  ul.innerHTML = `
    <li>Temp: ${currentWeather.temp}°F</li>
    <li>Wind: ${currentWeather.wind_speed} MPH</li>
    <li>Humidity: ${currentWeather.humidity} %</li>
    <li>UV Index ${renderUVI(currentWeather.uvi)}</li>
  `;

  dom.current.appendChild(ul);
}

function renderForecast(forecast) {
  const forecastSection = document.querySelector('#forecast');
  const header = document.createElement('header');
  const h2 = document.createElement('h2');

  header.classList.add('container');
  h2.innerText = '5-Day Forecast';

  header.appendChild(h2);
  forecastSection.appendChild(header);

  forecast.forEach(
    (
      { timezone, weather, temp: { day }, wind_speed: windSpeed, humidity },
      index,
    ) => {
      const ul = document.createElement('ul');
      ul.classList.add(
        'bg-info',
        'bg-gradient',
        'container',
        'list-unstyled',
        'mb-2',
        'mt-2',
        'py-2',
      );

      dom.addContent2Ul(
        ul,
        luxon.DateTime.local()
          .setZone(timezone)
          .plus({ days: index + 1 })
          .endOf('day')
          .toLocaleString(),
        'fs-4',
        'fw-bold',
      );
      dom.appendEl2Ul(ul, createIcon(weather[0]));
      dom.addContent2Ul(ul, `Temp: ${day}°F`);
      dom.addContent2Ul(ul, `Wind Speed: ${windSpeed} MPH`);
      dom.addContent2Ul(ul, `Humidity: ${humidity}%`);
      forecastSection.appendChild(ul);
    },
  );

  const lastUl = forecastSection.querySelector('ul:last-child');

  lastUl.classList.remove('mb-2');
  lastUl.classList.add('mb-0');
}

function renderHistoryButton(city) {
  dom.historySection.innerHTML += `<li class="list-group-item text-center"><button class="bg-secondary text-light">${city}</button></li>`;
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

export const render = async city => {
  const weather = await fetchWeather(city);
  const currentHeading = createCityDateHeading(city, weather.timezone);
  const iconSpan = createIcon(weather.current.weather[0]);

  dom.current.innerHTML = '';

  addCity2Storage(city);
  renderCurrentHeading(currentHeading, iconSpan);
  renderCurrentWeather(weather.current);
  renderForecast(weather.daily.slice(0, 5));
};

export function renderHistoryButtons() {
  dom.historySection.innerHTML = '';

  const searchHistory = localStorage.getItem('searchHistory');

  if (searchHistory) {
    JSON.parse(searchHistory).forEach(city => {
      renderHistoryButton(city);
    });
  }
}
