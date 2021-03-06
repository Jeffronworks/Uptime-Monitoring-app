/*
 * Create and export configuration variables
 *
 */
// Container for all the environments

const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

environments.production = {
  httpPort: 80,
  httpsPort: 443,
  envName: "production",
};

// Determine which environment was passed as a command-line argument

const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one of the above listed environemnts, else default to staging

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

// Export the module
module.exports = environmentToExport;
