import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  // Errores de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      details: err.errors,
    });
  }

  // Error de base de datos duplicado
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: "Registro duplicado",
      message: "El registro ya existe en la base de datos",
    });
  }

  // Error de autenticación JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token inválido",
      message: "El token proporcionado no es válido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expirado",
      message: "El token ha expirado, por favor inicia sesión nuevamente",
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
