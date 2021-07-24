/*
 * These are the request handlers
 *
 */

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// Define the handlers
const handlers = {};

// Users handler
handlers.users = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405); // this is the http status code of method not allowed
  }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: None
handlers._users.post = (data, callback) => {
  // Check that the required fields are filled out
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // Ensure that the user dosent already exist
    _data.read("users", phone, (err, data) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          // Create the user object
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement,
          };

          // Store the user
          _data.create("users", phone, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the password" });
        }
      } else {
        // User already exits
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - get
// Required data : phone
//Optional data : none
// @TODO Only let an authenticated user access their object, don't let them access anyone else
handlers._users.get = (data, callback) => {
  // check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    // lookup the user
    _data.read("users", phone, (err, data) => {
      if (!err && data) {
        // remove the hased password from the data object before returning it to the requester
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Users - put
// Required data : phone
//Optional data : firstName , lastName, password (at least one must be specified)
// @TODO Only let an authenticated user update their object, don't let them access anyone else
handlers._users.put = (data, callback) => {
  //check for required field, i.e the phone
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  //check for optional fields
  // Check that the required fields are filled out
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    // error out if nothing is sent to update
    if (firstName || lastName || password) {
      //  Lookup the user
      _data.read("users", phone, (err, userData) => {
        if (!err && userData) {
          //update the necessary fields
          if (firstName) userData.firstName = firstName;
          if (lastName) userData.lastName = lastName;
          if (password) userData.hashedPassword = helpers.hash(password);

          // store the updates
          _data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "could not update the user" });
            }
          });
        } else {
          callback(400, { Error: "The specified user does nor exist" });
        }
      });
    } else {
      callback(400, { Error: "No field to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Users - delete
// Required field : phone
// @TODO Only let an authenticated user delete their object, don't let them delete anyone else
// @TODO  cleanup everything assiotiated with the user
handlers._users.delete = (data, callback) => {
  //check for required field, i.e the phone
  const phone =
    typeof data.queryStringObject.phone == "string" &&
    data.queryStringObject.phone.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    //lookup the user
    _data.read("users", phone, (err, data) => {
      if (!err && data) {
        // Remove the user
        _data.delete("users", phone, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "unable to delete user" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// ping handler
handlers.ping = (data, callback) => {
  // callback a http status code, and a payload object5
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
