import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model";

const DEFAULT_ROLE_ID = 3; // dueno

export const registerUser = async (
  nombre: string,
  email: string,
  password: string,
) => {
  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser(
    nombre,
    email,
    hashedPassword,
    DEFAULT_ROLE_ID,
  );

  const token = jwt.sign(
    {
      id: userId,
      email,
      role: "dueno",
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  return token;
};
