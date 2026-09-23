import bcrypt from "bcrypt";
import prisma from "../../src/lib/prisma.js";
import { createUser } from "../../src/services/user.service.js";

import { describe, it, expect } from "vitest";

describe("UserService", () => {
  it("should store the password as a hash", async () => {
    const password = "123456";
    const email = `hash-${Date.now()}@example.com`;

    const user = await createUser({
      name: "Hash Test User",
      email,
      password,
    });

    const storedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(storedUser).not.toBeNull();
    expect(storedUser?.password).not.toBe(password);

    const isPasswordValid = await bcrypt.compare(
      password,
      storedUser!.password,
    );

    expect(isPasswordValid).toBe(true);
  });

  it("should creat a user with USER role by default", async () => {
    const email = `role-${Date.now()}@example.com`;

    const user = await createUser({
      name: "Role Test User",
      email,
      password: "123456",
    });

    expect(user.role).toBe("USER");
  });
});
