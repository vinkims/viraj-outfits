function generatePassword() {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharacters = '!@#$%^&*()-_=+<>?/[]{}';
  const numbers = '0123456789';

  const allCharacters = uppercaseLetters + lowercaseLetters + specialCharacters + numbers;

  const getRandomChar = (characters) => characters.charAt(Math.floor(Math.random() * characters.length));

  let password = '';

  password += getRandomChar(uppercaseLetters);

  password += getRandomChar(lowercaseLetters);

  password += getRandomChar(specialCharacters);

  // Ensure at least one number
  password += getRandomChar(numbers);

  // Fill the rest of the password with random characters
  for (let i = password.length; i < 10; i++) {
    password += getRandomChar(allCharacters);
  }

  // Shuffle the characters in the password
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  return password;
}

export default { generatePassword };