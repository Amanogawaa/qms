// Application layer - User management use cases
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserListItem,
} from '../domain/types';

export interface UserRepository {
  findAll(): Promise<UserListItem[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}

export class UserService {
  constructor(private repository: UserRepository) {}

  async getAllUsers(): Promise<UserListItem[]> {
    return this.repository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    // Validate email is unique
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error(`User with email "${data.email}" already exists`);
    }

    return this.repository.create(data);
  }

  async updateUser(data: UpdateUserDTO): Promise<User> {
    const user = await this.repository.findById(data.id);
    if (!user) {
      throw new Error(`User with id "${data.id}" not found`);
    }

    // If email is being updated, check it's not taken
    if (data.email && data.email !== user.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing) {
        throw new Error(`User with email "${data.email}" already exists`);
      }
    }

    return this.repository.update(data);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error(`User with id "${id}" not found`);
    }

    return this.repository.delete(id);
  }
}
