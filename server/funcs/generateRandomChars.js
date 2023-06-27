function generateRandomChars(many, lettersToo = true) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomChars = '';
  const charsLength = lettersToo ? chars.length : 10;
  for (let i = 0; i < many; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return randomChars;
}

module.exports = { generateRandomChars };
