export function formatDate(dateString) {
  // SQLite format: 'YYYY-MM-DD HH:mm:ss'
  // Convert to ISO format by replacing space with 'T' and adding 'Z' for UTC
  const isoString = dateString.replace(' ', 'T') + 'Z';

  return new Intl.DateTimeFormat('en-HK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Hong_Kong',
  }).format(new Date(isoString));
}
