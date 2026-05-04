import crypto from "crypto"

const generateSecurePassword = (length = 10) => {
  // Generates a random buffer and converts it to a base64 string
  // Then slices it to the desired length
  return crypto
    .randomBytes(length)
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '0')  // Optional: replace non-alphanumeric chars
    .replace(/\//g, '1');
};

export default generateSecurePassword;