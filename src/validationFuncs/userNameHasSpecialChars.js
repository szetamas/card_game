//TODO: may i wana use regexp instead of this
function userNameHasSpecialChars(userName) {
  for (let i = 0; i < userName.length; i++) {
    //check capital letters, then small letters, then numbers, then special chars
    if (
      !(userName.charCodeAt(i) >= 65 && userName.charCodeAt(i) <= 90) &&
      !(userName.charCodeAt(i) >= 97 && userName.charCodeAt(i) <= 122) &&
      !(userName.charCodeAt(i) >= 48 && userName.charCodeAt(i) <= 57) &&
      !(userName.charCodeAt(i) >= 33 && userName.charCodeAt(i) <= 47) &&
      !(
        userName[i] === '-' ||
        userName[i] === '_' ||
        userName[i] === '.' ||
        userName[i] === ':'
      )
    ) {
      return true;
    }
  }
}

module.exports = { userNameHasSpecialChars };
