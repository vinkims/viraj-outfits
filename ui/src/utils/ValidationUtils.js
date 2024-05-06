function validateInputs(conditions) {
  const errorMessages = [];

  for (const condition of conditions) {
    const { value, setError, setErrorText, errorMessage } = condition;
    if (!value) {
      setError(true);
      if (setErrorText) {
        setErrorText(errorMessage);
      }
      errorMessages.push(errorMessage);
    } else {
      setError(false);
      if (setErrorText) {
        setErrorText('');
      }
    }
  }

  return errorMessages;
}

export default {
  validateInputs
}