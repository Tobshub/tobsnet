import { usePrisma } from "../../../config/prisma";
import jwt from "jsonwebtoken";

type props = {
  email: string;
  password: string;
};

type options = {
  expires: "short" | "long";
};

export async function login(userData: props, options: options) {}
