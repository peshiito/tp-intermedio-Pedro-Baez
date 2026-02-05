export interface JwtPayload {
  //jsonwebtoken Payload personalizado
  id: number;
  email: string;
  nombre: string;
  rol_id: number;
}

export enum UserRole {
  USER = 2,
  ADMIN = 1,
}
