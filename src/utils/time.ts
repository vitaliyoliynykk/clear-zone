export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secondsFormated = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${secondsFormated}`;
};

export const formatDate = (
  iso: string | number,
  format: 'datetime' | 'time' = 'datetime'
) => {
  if (format === 'datetime') {
    return new Intl.DateTimeFormat('uk-UA', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));
  }

  return new Intl.DateTimeFormat('uk-UA', {
    timeStyle: 'short',
  }).format(new Date(iso));
};
