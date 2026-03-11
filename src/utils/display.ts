export function displayValue(
  value: string | undefined | null,
  fallback: string = 'N/A'
): string {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value;
}