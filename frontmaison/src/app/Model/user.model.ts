export enum UserRole {
  ADMIN = 'admin',
  RESPONSABLE = 'responsable',
  USER = 'user',
}

export enum UserStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export interface UserRegister {
  userId?: string; // Add userId to match JwtPayload.id
  email: string;
  name: string;
  password: string;
  dateNaissance?: Date | string;
  address?: string;
  telephone?: string;
  role?: UserRole;
  status?: UserStatus; // Added status field
}

export interface LoginModel {
  _id?: string; // Optional, as it may not always be used
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  name?: string; // Add optional fields from token
  dateNaissance?: string;
  address?: string;
  telephone?: string;
  status?: string; // Added status field
}