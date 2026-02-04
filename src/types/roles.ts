export enum UserRole {
  ADMIN = 1,
  VETERINARIO = 2,
  CLIENTE = 3,
}

export interface RoleCheck {
  role: UserRole;
  message?: string;
}
