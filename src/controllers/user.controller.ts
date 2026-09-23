import type { Request, Response } from "express";
import { createUser } from "../services/user.service.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const user = await createUser({
      name,
      email,
      password,
    });

    return res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      return res.status(409).json({ message: error.message });
    }
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
