export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}