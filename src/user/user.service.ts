import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(userDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(userDto);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async editById(id: string, userDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.userRepository.update(user.id, userDto);
  }

  async deleteById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (user.expenses.length > 0) {
      throw new ConflictException('Usuário com despesas não pode ser removido');
    }
    return this.userRepository.remove(user);
  }
}
