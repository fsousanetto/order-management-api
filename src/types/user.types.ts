import { Role } from "@prisma/client";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
