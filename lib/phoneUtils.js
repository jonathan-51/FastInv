/**
 * Phone number utility functions for normalizing Australian and New Zealand phone numbers
 * to E.164 format (+61 for AU, +64 for NZ)
 */

/**
 * Normalizes a phone number string to E.164 format
 * Supports Australian (+61) and New Zealand (+64) phone numbers
 *
 * @param {string} phoneNumber - The phone number to normalize
 * @param {string} defaultCountry - Default country code ('AU' or 'NZ'), defaults to 'AU'
 * @returns {string|null} - Normalized phone number in E.164 format or null if invalid
 *
 * @example
 * normalizePhoneNumber('0412 345 678') // '+61412345678'
 * normalizePhoneNumber('04 1234 5678', 'AU') // '+61412345678'
 * normalizePhoneNumber('021 123 4567', 'NZ') // '+6421123456'
 * normalizePhoneNumber('+61 412 345 678') // '+61412345678'
 */
export function normalizePhoneNumber(phoneNumber, defaultCountry = 'AU') {
  if (!phoneNumber) return null;

  // Remove all non-digit characters except leading +
  let cleaned = phoneNumber.toString().trim();
  cleaned = cleaned.replace(/\D/g, '');

  if (!cleaned) return null;

  // Handle numbers that already have country code
  if (cleaned.startsWith('61') || cleaned.startsWith('64')) {
    // Remove leading country code to re-add it properly
    if (cleaned.startsWith('61')) {
      cleaned = cleaned.substring(2);
      defaultCountry = 'AU';
    } else if (cleaned.startsWith('64')) {
      cleaned = cleaned.substring(2);
      defaultCountry = 'NZ';
    }
  }

  // Remove leading 0 if present (common in AU/NZ)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Validate and format based on country
  if (defaultCountry === 'AU') {
    return normalizeAustralianNumber(cleaned);
  } else if (defaultCountry === 'NZ') {
    return normalizeNewZealandNumber(cleaned);
  }

  return null;
}

/**
 * Normalizes Australian phone numbers to E.164 format
 * @private
 */
function normalizeAustralianNumber(digits) {
  // Australian mobile: 4XX XXX XXX (9 digits after removing leading 0)
  // Australian landline: (0X) XXXX XXXX (9 digits after removing leading 0)

  if (digits.length === 9) {
    // Mobile numbers start with 4
    // Landline area codes: 2, 3, 7, 8
    const firstDigit = digits[0];
    if (['2', '3', '4', '7', '8'].includes(firstDigit)) {
      return `+61${digits}`;
    }
  }

  // Check for 10-digit format (including area code with 0)
  if (digits.length === 10 && digits.startsWith('0')) {
    const withoutZero = digits.substring(1);
    return normalizeAustralianNumber(withoutZero);
  }

  return null;
}

/**
 * Normalizes New Zealand phone numbers to E.164 format
 * @private
 */
function normalizeNewZealandNumber(digits) {
  // NZ mobile: 02X XXX XXXX (9 digits after removing leading 0)
  // NZ landline: (0X) XXX XXXX (8-9 digits after removing leading 0)

  if (digits.length >= 8 && digits.length <= 10) {
    // Mobile numbers start with 2
    // Landline area codes: 3, 4, 6, 7, 9
    const firstDigit = digits[0];
    if (['2', '3', '4', '6', '7', '9'].includes(firstDigit)) {
      return `+64${digits}`;
    }
  }

  // Check for 10-digit format (including leading 0)
  if (digits.length === 10 && digits.startsWith('0')) {
    const withoutZero = digits.substring(1);
    return normalizeNewZealandNumber(withoutZero);
  }

  return null;
}

/**
 * Formats a phone number for display (adds spaces for readability)
 *
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {string} - Formatted phone number for display
 *
 * @example
 * formatPhoneNumberDisplay('+61412345678') // '+61 412 345 678'
 * formatPhoneNumberDisplay('+6421234567') // '+64 21 234 567'
 */
export function formatPhoneNumberDisplay(phoneNumber) {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '');

  if (phoneNumber.startsWith('+61') && cleaned.length === 11) {
    // Australian format: +61 4XX XXX XXX
    return `+61 ${cleaned.substring(2, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  } else if (phoneNumber.startsWith('+64') && cleaned.length >= 10) {
    // New Zealand format: +64 2X XXX XXXX
    if (cleaned.length === 11) {
      return `+64 ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
      return `+64 ${cleaned.substring(2, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
  }

  return phoneNumber;
}

/**
 * Validates if a phone number string is a valid AU or NZ number
 *
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} defaultCountry - Default country code ('AU' or 'NZ')
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber, defaultCountry = 'AU') {
  return normalizePhoneNumber(phoneNumber, defaultCountry) !== null;
}
