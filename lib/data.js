/*
 *   This is the library for storing and editing data
 *   It basically handles the CRUD operations in a the file- system
 */

// Importing Dependencies
const fs = require("fs");
const path = require("path");

// This is the container for the module to be exported
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data");

// Write data to a file
lib.create = function (dir, file, data, callback) {
  //Open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert the data to string
        const stringData = JSON.stringify(data);

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("There was and error closing the file");
              }
            });
          } else {
            callback("There was error writing to a new file");
          }
        });
      } else {
        callback(
          "could not create new file, it is possible that it already exists"
        );
      }
    }
  );
};

// Exporting the module
module.exports = lib;
