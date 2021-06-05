export default {
  current: document.querySelector('#current'),
  historySection: document.querySelector('#history'),
  addContent2Li(list, content) {
    const li = document.createElement('li');
    li.innerHTML = `${content}`;
    list.appendChild(li);
  },
  appendEl2Li(list, el) {
    const li = document.createElement('li');
    li.appendChild(el);
    list.appendChild(li);
  },
};
