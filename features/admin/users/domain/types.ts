// Domain types for User Management

export enum UserRole {
  RESIDENT = 'RESIDENT',
  STAFF = 'STAFF',
  OFFICER = 'OFFICER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UpdateUserDTO {
  id: string;
  email?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UserListItem {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: Date;
}
