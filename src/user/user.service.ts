import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}
  async create(email: string, pass: string): Promise<Partial<User>> {
    const { password, ...rest } = await this.userRepository.save({
      email,
      password: pass,
    });
    return rest;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOne(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const { password, ...rest } = user;
    return rest;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async deleteById(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne(id, {
      relations: ['expenses'],
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (user.expenses.length > 0) {
      throw new ConflictException('Usuário com despesas não pode ser removido');
    }
    return this.userRepository.remove(user);
  }
}
