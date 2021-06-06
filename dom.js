export default {
  current: document.querySelector('#current'),
  historySection: document.querySelector('#history'),
  addContent2Ul(list, content, ...classes) {
    console.log(classes, 'an');
    const li = document.createElement('li');
    if (classes.length) {
      classes.forEach(cl => {
        li.classList.add(cl);
      });
    }

    li.innerHTML = `${content}`;
    list.appendChild(li);
  },
  appendEl2Ul(list, el) {
    const li = document.createElement('li');
    li.appendChild(el);
    list.appendChild(li);
  },
};
