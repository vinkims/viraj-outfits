function formatDate(dateStr) {
  if (!dateStr) {
    return '';
  }

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(5, 7);
  const day = dateStr.slice(8, 10);
  const hour = dateStr.slice(11, 13);
  const minute = dateStr.slice(14, 16);
  const second = dateStr.slice(17, 19);

  const dateObj = `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  return dateObj;
}

function formatMobileNumber(mobileNo) {
  if (mobileNo.startsWith("0")) {
    return mobileNo.replace("0", "254");
  } else if (mobileNo.startsWith("+254")) {
    return mobileNo.replace("+254", "254");
  } else {
    return mobileNo;
  }
}

function formatShortDate(dateStr) {
  if (!dateStr || dateStr.length === 0) {
    return '';
  }

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(5, 7);
  const day = dateStr.slice(8, 10);

  return `${day}-${month}-${year}`;
}

function getFirstLastMonthDate(position) {
  var today = new Date();
  var firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return position === 'first' ? firstDate : lastDate;
}

function isPasswordValid(password) {

  const errorMessages = [];

  if (password.length < 6) {
    errorMessages.push("Should be between 6-15 chars long");
    // return false;
  }

  const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
  if (!specialCharacterRegex.test(password)) {
    errorMessages.push("Should contain at least one special character");
    // return false;
  }

  const uppercaseLetterRegex = /[A-Z]/;
  if (!uppercaseLetterRegex.test(password)) {
    errorMessages.push("Should contain at least one uppercase letter");
    // return false;
  }

  const numberRegex = /[0-9]/;
  if (!numberRegex.test(password)) {
    errorMessages.push("Should contain at least one number")
    // return false;
  }

  return errorMessages;
}

function splitName(name) {
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length === 1) {
    return {
      FirstName: nameParts.pop()
    };
  } else if (nameParts.length === 2) {
    return {
      LastName: nameParts.pop(),
      FirstName: nameParts.pop(),
    };
  } else if (nameParts.length >= 3) {
    return {
      LastName: nameParts.pop(),
      FirstName: nameParts.shift(),
      MiddleName: nameParts.join(' '),
    };
  }
}

export default { 
  formatDate, 
  formatMobileNumber, 
  formatShortDate, 
  getFirstLastMonthDate, 
  isPasswordValid, 
  splitName 
};