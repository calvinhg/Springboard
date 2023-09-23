process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testComp, testInv;

beforeEach(async () => {
  const compRes = await db.query(
    "INSERT INTO companies (code, name, description) VALUES ('test', 'TestComp', 'This is a test company.') RETURNING *"
  );
  testComp = compRes.rows[0];
  const invRes = await db.query(
    `INSERT INTO invoices (comp_code, amt) VALUES ('test', 123.45) RETURNING *`
  );
  testInv = invRes.rows[0];
  testInv.add_date = testInv.add_date.toISOString();
});

afterEach(async () => {
  await db.query("DELETE FROM invoices; DELETE FROM companies;");
});

afterAll(async () => await db.end());

describe("GET /invoices", () => {
  test("Get a list with one invoice", async () => {
    const res = await request(app).get("/invoices");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      invoices: [{ comp_code: testInv.comp_code, id: testInv.id }],
    });
  });
});

describe("GET /invoices/:code", () => {
  test("Get a single invoice", async () => {
    const res = await request(app).get(`/invoices/${testInv.id}`);
    expect(res.statusCode).toBe(200);
    delete testInv.comp_code;
    testInv.company = testComp;
    expect(res.body).toEqual({ invoice: testInv });
  });

  test("Get an invalid invoice", async () => {
    const res1 = await request(app).get("/invoices/999999");
    expect(res1.statusCode).toBe(404);
    expect(res1.body).toEqual({
      error: { message: "Invoice with id 999999 not found", status: 404 },
    });
    const res2 = await request(app).get("/invoices/1a3");
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toEqual({
      error: { message: "1a3 is not a valid id!", status: 400 },
    });
  });
});

describe("POST /invoices", () => {
  test("Add an invoice", async () => {
    const anotherInvoice = { comp_code: "test", amt: 100 };
    const res = await request(app).post("/invoices").send(anotherInvoice);
    expect(res.statusCode).toBe(201);

    expect(res.body.invoice).toHaveProperty("add_date");
    expect(res.body.invoice).toHaveProperty("id");
    delete res.body.invoice.add_date;
    delete res.body.invoice.id;

    anotherInvoice.paid = false;
    anotherInvoice.paid_date = null;
    expect(res.body).toEqual({ invoice: anotherInvoice });
  });

  test("Add an invoice with missing info", async () => {
    const res = await request(app).post("/invoices").send({ amt: 100 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: "Please include a company code and valid amount",
        status: 400,
      },
    });
  });

  test("Add an invoice with invalid company", async () => {
    const anotherInvoice = { comp_code: "nottest", amt: 100 };
    const res = await request(app).post("/invoices").send(anotherInvoice);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Company code doesn't exist", status: 400 },
    });
  });
});

describe("PUT /invoices/:id", () => {
  test("Update an invoice", async () => {
    const updatedInvoice = { comp_code: "test", amt: 50 };
    const res = await request(app)
      .put(`/invoices/${testInv.id}`)
      .send(updatedInvoice);
    expect(res.statusCode).toBe(200);

    expect(res.body.invoice).toHaveProperty("add_date");
    expect(res.body.invoice).toHaveProperty("id");
    delete res.body.invoice.add_date;
    delete res.body.invoice.id;

    updatedInvoice.paid = false;
    updatedInvoice.paid_date = null;
    expect(res.body).toEqual({ invoice: updatedInvoice });
  });

  test("Update an invoice with missing amount", async () => {
    const res = await request(app)
      .put(`/invoices/${testInv.id}`)
      .send({ comp_code: "test" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Please include a new amount", status: 400 },
    });
  });

  test("Update an invoice with invalid amount", async () => {
    const res = await request(app)
      .put(`/invoices/${testInv.id}`)
      .send({ comp_code: "test", amt: -20.3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Amount $-20.3 must be greater than 0", status: 400 },
    });
  });
});

describe("DELETE /invoices/:id", () => {
  test("Delete an invoice", async () => {
    const res = await request(app).delete(`/invoices/${testInv.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "deleted" });
  });

  test("Delete an invalid invoice", async () => {
    const res = await request(app).delete(`/invoices/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: { message: "Invoice with id 999999 not found", status: 404 },
    });
  });
});
