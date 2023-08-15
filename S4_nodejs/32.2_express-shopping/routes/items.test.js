process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let banana;

beforeEach(() => {
  banana = { name: "banana", price: "0.99" };
  items.push(banana);
});

afterEach(() => (items.length = 0));

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [banana] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${banana.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: banana });
  });

  test("Get a 404 item", async () => {
    const res = await request(app).get(`/items/lemon`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});

describe("POST /items", () => {
  test("Create an item", async () => {
    const apple = { name: "apple", price: "0.89" };
    const res = await request(app).post("/items").send(apple);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: apple });
  });

  test("Create an item with missing params", async () => {
    const res1 = await request(app).post("/items").send({ name: "orange" });
    expect(res1.statusCode).toBe(400);
    expect(res1.body).toEqual({ error: "Missing name or price" });
    const res2 = await request(app).post("/items").send({ price: "1.09" });
    expect(res2.statusCode).toBe(400);
  });

  test("Create an item that already exists", async () => {
    const res = await request(app).post("/items").send(banana);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Item already exists" });
  });
});

describe("/PATCH /items/:name", () => {
  test("Update an item's price", async () => {
    const res = await request(app)
      .patch(`/items/${banana.name}`)
      .send({ price: "0.49" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "banana", price: "0.49" } });
  });

  test("Update an item's name", async () => {
    const res = await request(app)
      .patch(`/items/${banana.name}`)
      .send({ name: "bananas" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "bananas", price: "0.99" } });
  });

  test("Update an item's name and price", async () => {
    const res = await request(app)
      .patch(`/items/${banana.name}`)
      .send({ name: "bananas", price: "0.49" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "bananas", price: "0.49" } });
  });

  test("Update a 404 item", async () => {
    const res = await request(app)
      .patch(`/items/lemon`)
      .send({ price: "1.59" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Delete an item", async () => {
    const res = await request(app).delete(`/items/${banana.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });

  test("Delete a 404 item", async () => {
    const res = await request(app).delete(`/items/lemon`);
    expect(res.statusCode).toBe(404);
  });
});
