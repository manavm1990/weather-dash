export function capitalizeEachWord(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getDateWithAddlDays(addlDays = 0) {
  const now = new Date(Date.now());

  return `${now.getMonth() + 1}/${
    now.getDate() + addlDays
  }/${now.getFullYear()}`;
}
