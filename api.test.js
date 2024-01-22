import request from "supertest";
import express from "express";
const app = express();

app.listen(7000, () => {})
const baseURL = "https://reservation-zeta.vercel.app";
let token;

// Test room endpoints
describe("GET /rooms", () => {
  jest.setTimeout(15000);
  it("Should return rooms", async () => {
    const roomsResponse = await request(baseURL).get("/rooms");
    expect(roomsResponse.statusCode).toBe(200);
    expect(roomsResponse.body).toBeInstanceOf(Array);
  });

  it("Should not return rooms", async () => {
    const roomsResponse = await request(baseURL).post("/rooms");
    expect(roomsResponse.statusCode).toBe(404);
  });

  it("Should not return rooms", async () => {
    const roomsResponse = await request(baseURL).get("/roomss");
    expect(roomsResponse.statusCode).toBe(404);
  });
});




// Test user access
describe("GET /users", () => {
  it("Should not allow access to unauthorized users", async () => {
    const usersResponse = await request(baseURL)
      .get("/users")
      .set('Authorization', ``);

    expect(usersResponse.statusCode).toBe(401);
  });

  it("Should allow access to authorized users", async () => {
    const loginResponse = await request(baseURL)
          .post("/login")
          .send({
            email: "hicode250@gmail.com",
            password: "hicode250" 
          }); //correct credentials

    // Extract the token from the login response
    token = loginResponse.body.token;
    // Use the token to retrieve a list of users
    const usersResponse = await request(baseURL)
      .get("/users")
      .set('token', `Bearer ${token}`);

    expect(usersResponse.statusCode).toBe(200);
  });
});

describe("GET /user", () => {
  it("Should not allow access to unauthorized users", async () => {
    const singleUserResponse = await request(baseURL)
      .get("/user/659aae41f1fc8f1ef419bee7")
      .set('token', ``);

    expect(singleUserResponse.statusCode).toBe(401);
  });

  it("Should allow access to authorized users", async () => {
    // Use the token to retrieve a single user
    const singleUserResponse = await request(baseURL)
      .get("/user/659aae41f1fc8f1ef419bee7")
      .set('token', `Bearer ${token}`);

    expect(singleUserResponse.statusCode).toBe(200);
  });
});


// Test Successful login
describe("POST /login", () => {
  it("Should not login", async () => {
    const loginResponse = await request(baseURL)
      .post("/login")
      .send({
        email: "hicode250@gmail.com",
        password: "-----------"
      });
    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.body.token).toBe(undefined);
  });
  it("Should login", async () => {
    const loginResponse = await request(baseURL)
      .post("/login")
      .send({
        email: "hicode250@gmail.com",
        password: "hicode250"
      });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toEqual(expect.anything())
  });
});
