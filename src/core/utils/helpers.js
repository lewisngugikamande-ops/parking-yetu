export function formatTime(timestamp) {
  if (!timestamp) return 'N/A';
  if (timestamp.toDate) return timestamp.toDate().toLocaleTimeString();
  if (timestamp instanceof Date) return timestamp.toLocaleTimeString();
  if (typeof timestamp === 'string') return new Date(timestamp).toLocaleTimeString();
  return 'N/A';
}

export function formatDuration(minutes) {
  if (!minutes || minutes < 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return hours + 'h ' + mins + 'm';
  return mins + 'm';
}

export function calculateDuration(timestamp) {
  if (!timestamp) return { text: 'N/A', minutes: 0 };
  const now = new Date();
  const entry = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = now - entry;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  let text = '';
  if (diffHours > 0) {
    text = diffHours + 'h ' + remainingMins + 'm';
  } else {
    text = diffMins + 'm';
  }
  return { text: text, minutes: diffMins, hours: diffHours, mins: remainingMins };
}
