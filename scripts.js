import { addCity2Storage, fetchCurrentWeather, fetchForecast } from './api.js';

const history = document.querySelector('#history');

function renderHistoryButton(city) {
  history.innerHTML += `<li class="list-group-item text-center"><button class="bg-secondary text-light">${city}</button></li>`;
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;
  const weather = await fetchCurrentWeather(city);

  addCity2Storage(city);
  renderHistoryButton(city);
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const city = event.target.innerText;
  const weather = await fetchCurrentWeather(city);
});
