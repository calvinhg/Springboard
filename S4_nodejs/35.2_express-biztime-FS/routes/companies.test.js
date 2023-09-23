process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testComp;

beforeEach(async () => {
  const compRes = await db.query(
    "INSERT INTO companies (code, name, description) VALUES ('test', 'TestComp', 'This is a test company.') RETURNING *"
  );
  testComp = compRes.rows[0];
});

afterEach(async () => await db.query("DELETE FROM companies"));

afterAll(async () => await db.end());

describe("GET /companies", () => {
  test("Get a list with one company", async () => {
    const res = await request(app).get("/companies");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [testComp] });
  });
});

describe("GET /companies/:code", () => {
  test("Get a single company", async () => {
    const res = await request(app).get(`/companies/${testComp.code}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.company.invoices).toBeInstanceOf(Array);
    delete res.body.company.invoices;
    expect(res.body).toEqual({ company: testComp });
  });
  test("Get an invalid company", async () => {
    const res = await request(app).get("/companies/nope");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /companies", () => {
  test("Add a company", async () => {
    const anotherTestComp = {
      code: "postTest",
      name: "Post Office",
      description: "incompetents",
    };
    const res = await request(app).post("/companies").send(anotherTestComp);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ company: anotherTestComp });
  });

  test("Add a company with conflicting code", async () => {
    testComp.name = "Not TestComp";
    const res = await request(app).post("/companies").send(testComp);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Company code already exists!", status: 400 },
    });
  });

  test("Add a company with conflicting name", async () => {
    testComp.code = "nottest";
    const res = await request(app).post("/companies").send(testComp);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Company name already exists!", status: 400 },
    });
  });
});

describe("PUT /companies/:id", () => {
  test("Update a company", async () => {
    const newName = {
      name: "New Company",
      description: "Under new managment!",
    };
    const res = await request(app)
      .put(`/companies/${testComp.code}`)
      .send(newName);
    expect(res.statusCode).toBe(200);
    newName.code = testComp.code;
    expect(res.body).toEqual({ company: newName });
  });

  test("Update a company with conflicting name", async () => {
    const anotherTestComp = {
      code: "postTest",
      name: "Post Office",
      description: "incompetents",
    };
    await request(app).post("/companies").send(anotherTestComp);

    anotherTestComp.name = testComp.name;
    const res = await request(app)
      .put("/companies/postTest")
      .send(anotherTestComp);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Company name already exists!", status: 400 },
    });
  });
});

describe("DELETE /companies/:id", () => {
  test("Delete a company", async () => {
    const res = await request(app).delete(`/companies/${testComp.code}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "deleted" });
  });

  test("Delete an invalid company", async () => {
    const res = await request(app).delete(`/companies/nope`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: { message: "Company with code nope not found", status: 404 },
    });
  });
});
