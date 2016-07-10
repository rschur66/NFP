export function formatDateSlash(date) {
  let formattedDate = new Date(date).toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});
  return formattedDate;
}

export function formatMonthName(monthNum) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return months[monthNum];
}
