import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

import type {
  CreateUserInput,
  CreateUserResponse,
} from "../types/user.types.js";

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserInput): Promise<CreateUserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
