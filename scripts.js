import {
  addCity2Storage,
  fetchWeather,
  renderCurrent,
  renderForecast,
  renderHistoryButtons,
} from './lib.js';

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;
  const forecast = await fetchWeather(city);

  renderCurrent(city, forecast.current, forecast.timezone);
  renderForecast(forecast.daily.slice(0, 5));
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
