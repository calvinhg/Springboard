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
    expect(res.body.company.industries).toBeInstanceOf(Array);
    delete res.body.company.invoices;
    delete res.body.company.industries;
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
      name: "Post Office",
      description: "incompetents",
    };
    const res = await request(app).post("/companies").send(anotherTestComp);
    expect(res.statusCode).toBe(201);
    expect(res.body.company.code).toBe("Post-Office");
    anotherTestComp.code = "Post-Office";
    expect(res.body).toEqual({ company: anotherTestComp });
  });

  test("Add a company with conflicting code", async () => {
    testComp.name = "test";
    const res = await request(app).post("/companies").send(testComp);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message:
          "Auto-generated company code already exists. Please include a new code.",
        status: 400,
      },
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

describe("POST /companies/:code", () => {
  test("Update a company", async () => {
    const newName = {
      name: "New Company",
      description: "Under new managment!",
    };
    const res = await request(app)
      .post(`/companies/${testComp.code}`)
      .send(newName);
    expect(res.statusCode).toBe(200);
    newName.code = testComp.code;
    expect(res.body).toEqual({ company: newName });
  });

  test("Update a company with conflicting name", async () => {
    const anotherTestComp = {
      name: "Post Office",
      description: "incompetents",
    };
    await request(app).post("/companies").send(anotherTestComp);

    anotherTestComp.name = testComp.name;
    const res = await request(app)
      .post("/companies/Post-Office")
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
