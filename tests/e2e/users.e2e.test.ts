import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("POST /users", () => {
  it("should create a ne user and return the user data", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: `testuser${Date.now()}@example.com`,
        password: "123456",
      });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");
    expect(response.body.email).toContain("@example.com");
    expect(response.body.role).toBe("USER");
    expect(response.body).not.toHaveProperty("password");
  });

  it("should not create a user with an existing email", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await request(app).post("/users").send({
      name: "First User",
      email,
      password: "123456",
    });

    const response = await request(app).post("/users").send({
      name: "Second User",
      email,
      password: "654321",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "User with this email already exists",
    });
  });

  it("sholud return 400 when required fields are missing", async () => {
    const response = await request(app).post("/users").send({
      name: "Incomplete User",
      email: "incomplete@example.com",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Name, email, and password are required",
    });
  });
});
