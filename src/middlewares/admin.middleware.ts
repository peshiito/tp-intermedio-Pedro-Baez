import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  if (req.user.rol_id !== 1) {
    return res.status(403).json({
      message: "Acceso solo para administradores",
    });
  }

  next();
};
