import { render, renderHistoryButtons } from './app.js';

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();

  const city = event.target.elements[0].value;

  render(city);
  renderHistoryButtons();
});

// Bubbling 🧋
document.querySelector('#history').addEventListener('click', async event => {
  const city = event.target.innerText;

  render(city);
});

renderHistoryButtons();
