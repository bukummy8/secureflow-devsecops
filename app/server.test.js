
const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("./server");

async function request(path) {
  const server = app.listen(0);

  try {
    const address = server.address();
    const response = await fetch(
      `http://127.0.0.1:${address.port}${path}`
    );

    return {
      status: response.status,
      contentType: response.headers.get("content-type"),
      body: await response.json(),
    };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

test("GET / returns SecureFlow project information", async () => {
  const response = await request("/");

  assert.equal(response.status, 200);
  assert.match(response.contentType, /application\/json/);
  assert.deepEqual(response.body, {
    project: "SecureFlow",
    message: "DevSecOps API is running",
    version: "1.0.0",
  });
});

test("GET /health returns a healthy status", async () => {
  const response = await request("/health");

  assert.equal(response.status, 200);
  assert.match(response.contentType, /application\/json/);
  assert.deepEqual(response.body, {
    status: "healthy",
  });
});

test("GET /api returns service information", async () => {
  const response = await request("/api");

  assert.equal(response.status, 200);
  assert.match(response.contentType, /application\/json/);
  assert.deepEqual(response.body, {
    service: "secureflow-api",
    environment: process.env.NODE_ENV || "development",
    message: "Hello from SecureFlow DevSecOps!",
  });
});