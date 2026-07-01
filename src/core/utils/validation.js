export function validatePlate(plate) {
  if (!plate) return { valid: false, error: 'Plate number is required' };
  const cleaned = plate.toUpperCase().replace(/\s/g, '');
  const regex = /^[A-Z]{3}\d{3}[A-Z]?$/;
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Invalid plate format. Use: KDG832A' };
  }
  return { valid: true, value: cleaned };
}

export function validatePhone(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.length < 10 || cleaned.length > 15) {
    return { valid: false, error: 'Phone must be 10-15 digits' };
  }
  return { valid: true, value: cleaned };
}

export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Name is required' };
  }
  return { valid: true, value: name.trim() };
}
