const http = require("http");
const url = require("url");
const queryString = require("querystring");

const METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
};

const users = [];
// user {id: number, name: string, age: number, addresses: [{street: string, buildingNumber: number}]}

// Create new server

// NOTE: Always use json while sending data from postman

// route create user           POST localhost:4000/users

// route delete user by id     DELETE localhost:4000/users?userId=1

// route update user           PUT localhost:4000/users?userId=1

// route get users             GET localhost:4000/users

// route get user by id        GET localhost:4000/users?userId=1

http
  .createServer(function (request, response) {
    const method = request.method; // POST, GET, etc...
    const parsedUrl = url.parse(request.url);
    const qs = queryString.parse(parsedUrl.query);
    const userId = Number(qs.userId);

    if (parsedUrl.pathname === "/users") {
      if (request.method === METHODS.GET) {
        if (userId) {
          const user = users.find((u) => u.id === userId);
          return createCustomResponse(response, 200, user);
        } else {
          return createCustomResponse(response, 200, users);
        }
      } else if (method === METHODS.POST) {
        let data = "";
        request.on("data", (chunk) => {
          data += chunk;
        });

        request.on("end", () => {
          const user = JSON.parse(data);
          users.push(user);

          return createCustomResponse(response, 201, user);
        });
      } else if (method === METHODS.PUT) {
        let data = "";
        request.on("data", (chunk) => {
          data += chunk;
        });

        request.on("end", () => {
          const user = JSON.parse(data);
          const index = users.findIndex((u) => u.id === userId);
          users[index] = user;

          return createCustomResponse(response, 200, user);
        });
      } else if (method === METHODS.DELETE) {
        const index = users.findIndex((u) => u.id === userId);
        const user = users.splice(index, 1);
        return createCustomResponse(response, 200, index > -1 ? user[0] : null);
      }2
    }
  })
  .listen(4000, () => {
    console.log("Server is up and running on port 4000");
  });

function createCustomResponse(
  response,
  code,
  data,
  contentType = "application/json"
) {
  response.writeHead(code, { "Content-Type": contentType });
  response.end(JSON.stringify(data));
}
