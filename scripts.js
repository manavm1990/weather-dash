import { fetchCurrentWeather, fetchForecast } from './api.js';

const history = document.querySelector('#history');

function renderHistoryButton(city) {
  history.innerHTML += `<li class="list-group-item text-center"><button class="bg-secondary text-light">${city}</button></li>`;
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;

  renderHistoryButton(city);

  const weather = await fetchCurrentWeather(city);
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const weather = await fetchCurrentWeather(event.target.innerText);
});
