import {
  addCity2Storage,
  fetchWeather,
  renderCurrent,
  renderHistoryButtons,
} from './lib.js';

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
