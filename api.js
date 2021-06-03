const API_KEY = '7cec0fb8a60ef89be9b2dc4e97fa3557';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/onecall';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

function capitalizeEachWord(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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

export const fetchCurrentWeather = async city => {
  const data = await fetch(
    `${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=imperial`,
  );

  return data.json();
};

export const fetchForecast = async (lat, lon) => {
  const data = await fetch(
    `${FORECAST_URL}?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts,units=imperial`,
  );

  return data.json();
};
