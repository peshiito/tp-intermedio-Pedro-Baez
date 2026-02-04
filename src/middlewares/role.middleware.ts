import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/roles";
import { JwtPayload } from "../types/auth";

export const requireRole = (allowedRoles: UserRole[]) => {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(req.user.rol_id)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};

// Middlewares específicos
export const requireAdmin = requireRole([UserRole.ADMIN]);
export const requireVeterinario = requireRole([UserRole.VETERINARIO]);
export const requireCliente = requireRole([UserRole.CLIENTE]);
export const requireAdminOrVeterinario = requireRole([
  UserRole.ADMIN,
  UserRole.VETERINARIO,
]);
