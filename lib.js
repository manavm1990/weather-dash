const API_KEY = '7cec0fb8a60ef89be9b2dc4e97fa3557';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

const current = document.querySelector('#current');
const history = document.querySelector('#history');

function capitalizeEachWord(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const createCityDateHeading = city => {
  const h2 = document.createElement('h2');

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${city} (${getDate()})`;

  return h2;
};

const createIcon = weatherInfo => {
  const span = document.createElement('span');

  span.innerHTML = `<img src="https://openweathermap.org/img/w/${
    weatherInfo.icon
  }.png" alt="${weatherInfo.description || weatherInfo.main}" />`;

  return span;
};

const fetchCoord = async city => {
  const data = await fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}`);

  const { coord } = await data.json();
  return coord;
};

const fetchForecast = async (lat, lon) => {
  const data = await fetch(
    `${FORECAST_URL}?&appid=${API_KEY}&lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial`,
  );

  return data.json();
};

function getDate(addlDays = 0) {
  const now = new Date(Date.now());

  return `${now.getMonth() + 1}/${
    now.getDate() + addlDays
  }/${now.getFullYear()}`;
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

export const addCity2Storage = city => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(capitalizeEachWord(city))) {
    localStorage.setItem(
      'searchHistory',
      JSON.stringify([...searchHistory, capitalizeEachWord(city)]),
    );
  }
};

export const fetchWeather = city =>
  fetchCoord(city)
    .then(coords => coords)
    .then(({ lat, lon }) => fetchForecast(lat, lon));

export function renderCurrent(city, currentForecast) {
  current.innerHTML = '';
  const currentHeading = createCityDateHeading(city);
  const iconSpan = createIcon(currentForecast.weather[0]);

  renderCurrentHeading(currentHeading, iconSpan);
  renderCurrentWeather(currentForecast);
}

export const renderForecast = forecast => {
  const forecastSection = document.querySelector('#forecast');
  const ul = document.createElement('ul');

  ul.innerHTML = forecast
    .map((_, index) => `<li>${getDate(index + 1)}</li>`)
    .join('');

  console.log(ul, 'hi');
  forecastSection.appendChild(ul);
};

export function renderHistoryButtons() {
  history.innerHTML = '';

  const searchHistory = localStorage.getItem('searchHistory');

  if (searchHistory) {
    JSON.parse(searchHistory).forEach(city => {
      renderHistoryButton(city);
    });
  }
}
