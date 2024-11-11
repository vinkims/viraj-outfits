function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // get the ordinal suffix
  const getOrdinal = (n) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return suffixes[(value - 20) % 100] || suffixes[value] || suffixes[0];
  }

  return `${day}${getOrdinal(day)} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

export default {
  formatDate
}