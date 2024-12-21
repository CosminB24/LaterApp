const MONTHS_RO = {
  'ianuarie': 0,
  'februarie': 1,
  'martie': 2,
  'aprilie': 3,
  'mai': 4,
  'iunie': 5,
  'iulie': 6,
  'august': 7,
  'septembrie': 8,
  'octombrie': 9,
  'noiembrie': 10,
  'decembrie': 11
};

export const convertToDateFormat = (dateStr: string): string => {
  const [day, month] = dateStr.toLowerCase().trim().split(/\s+/);
  const monthIndex = MONTHS_RO[month as keyof typeof MONTHS_RO];
  
  if (monthIndex === undefined) {
    throw new Error('Lună invalidă');
  }

  const date = new Date();
  const year = date.getFullYear();
  
  // Creăm data folosind UTC pentru a evita problemele cu fusul orar
  const targetDate = new Date(Date.UTC(year, monthIndex, parseInt(day)));
  
  // Formatăm data în formatul YYYY-MM-DD
  return targetDate.toISOString().split('T')[0];
};

export const convertToTimeFormat = (timeStr: string): string => {
  const [hours, minutes = '00'] = timeStr.split(':');
  const paddedHours = hours.padStart(2, '0');
  const paddedMinutes = minutes.padStart(2, '0');
  
  return `${paddedHours}:${paddedMinutes}`;
}; 