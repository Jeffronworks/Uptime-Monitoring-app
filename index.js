const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");

  // Get query string as an object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toUpperCase();

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
      payload: buffer,
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
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // callback a http status code, and a payload object5
  callback(406, { name: "sample handler" });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};
// Define request router
const router = {
  sample: handlers.sample,
};
