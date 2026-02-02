import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model";
import { JwtPayload } from "../types/auth";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

export const registerUser = async (
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  telefono?: string,
  direccion?: string,
): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser({
    nombre,
    apellido,
    email,
    password: hashedPassword,
    telefono,
    direccion,
    rol_id: 2, // USER por defecto
  });

  return userId;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<string> => {
  const invalidCredentialsError = new Error("Credenciales inválidas");

  const user = await findUserByEmail(email);
  if (!user) throw invalidCredentialsError;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw invalidCredentialsError;

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol_id: user.rol_id,
  };

  const options: SignOptions = {
    expiresIn: "1h",
    issuer: "patitas-felices",
  };

  return jwt.sign(payload, secretKey, options);
};
