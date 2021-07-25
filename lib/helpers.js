/*
 * This file is just helpers for various tasks
 *
 */

// Dependencies
const crypto = require("crypto");
const config = require("./config");

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
      .createHmac("SHA256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases, without throwing an Error
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
};

// Create a string of random alphanumeric charactersy, of a given length
helpers.createRandomString = (stringLength) => {
  // input Validation
  stringLength =
    typeof stringLength == "number" && stringLength > 0 ? stringLength : false;
  if (stringLength) {
    // Define all possible characters that could go into the random string
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    // create the string
    let str = "";
    for (i = 1; i <= stringLength; i++) {
      // get a random charcter from the possibleCharacters
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // append random character to the stringn
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

// Export the
module.exports = helpers;
