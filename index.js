/*
 * Primary file for the API
 *
 */

const http = require("http");
const https = require("https");
const url = require("url");
const config = require("./lib/config");
const fs = require("fs");
const handlers = require("./lib/handlers");

const StringDecoder = require("string_decoder").StringDecoder;
const helpers = require("./lib/helpers");

//Instantiate the Http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

//Instatiate the Https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.perm"),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

//Start the https sever
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `The server is listening on port ${config.httpsPort} in ${config.envName} mode now`
  );
});

// start the http server
httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is listening on port ${config.httpPort} in ${config.envName} mode now`
  );
});

// All the server logic for both Http and https server

const unifiedServer = (req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");

  // Get query string as an object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get header object
  const headers = req.headers;

  // get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. if one is not found, use the notfound handler
    const chosenHandler =
      typeof router[trimedPath] !== "undefined"
        ? router[trimedPath]
        : handlers.notFound;

    // construct the data object to send to the handler

    const data = {
      trimedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route teh request ro the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty string
      payload = typeof payload == "object" ? payload : {};

      // Convert payload to string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader("Content-Type", "application/JSON");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
};

// Define request router
const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
};
