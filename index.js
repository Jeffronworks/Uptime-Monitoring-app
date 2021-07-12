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

    // Send the response
    res.end("hello world");

    // Log the request path
    console.log(
      `Request recieved on path ${trimedPath} with method: ${method} with  query string`,
      queryStringObject
    );
    console.log("the request was recieved with these payload:", buffer);
  });
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000");
});
