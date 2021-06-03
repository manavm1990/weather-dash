const API_KEY = '7cec0fb8a60ef89be9b2dc4e97fa3557';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

function capitalizeEachWord(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

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

export const addCity2Storage = city => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(capitalizeEachWord(city))) {
    localStorage.setItem(
      'searchHistory',
      JSON.stringify([...searchHistory, capitalizeEachWord(city)]),
    );
  }
};

export const createCityDateHeading = city => {
  const h2 = document.createElement('h2');
  const now = new Date(Date.now());

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${city} (${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()})`;

  return h2;
};

export const createIcon = weatherInfo => {
  const span = document.createElement('span');

  span.innerHTML = `<img src="https://openweathermap.org/img/w/${
    weatherInfo.icon
  }.png" alt="${weatherInfo.description || weatherInfo.main}" />`;

  return span;
};

export const fetchWeather = city =>
  fetchCoord(city)
    .then(coords => coords)
    .then(({ lat, lon }) => fetchForecast(lat, lon));
