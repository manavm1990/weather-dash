import { addCity2Storage, fetchCurrentWeather } from './api.js';

const current = document.querySelector('#current');
const history = document.querySelector('#history');

const state = {
  lat: null,
  long: null,
};

function renderCurrent({ name }) {
  const h2 = document.createElement('h2');
  const now = new Date(Date.now());

  h2.classList.add('fs-2', 'fw-bold');
  h2.innerText = `${name} (${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()})`;

  current.innerHTML = '';
  current.appendChild(h2);
}

function renderHistoryButton(city) {
  history.innerHTML += `<li class="list-group-item text-center"><button class="bg-secondary text-light">${city}</button></li>`;
}

function renderHistoryButtons() {
  history.innerHTML = '';
  JSON.parse(localStorage.getItem('searchHistory')).forEach(city => {
    renderHistoryButton(city);
  });
}

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;
  const weather = await fetchCurrentWeather(city);

  addCity2Storage(city);
  renderCurrent(weather);
  renderHistoryButtons();
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const city = event.target.innerText;
  const weather = await fetchCurrentWeather(city);
  renderCurrent(weather);
});
