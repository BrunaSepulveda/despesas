import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { Expense } from './expense.entity';
import { User } from '../user/user.entity';
import { CreateExpenseDto } from './create-expense.dto';
import { UpdateExpenseDto } from './update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    return this.expenseRepository.save({ ...createExpenseDto, user });
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: User) {
    const expense = await this.expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException('Despensa não foi encontrada');
    }
    if (expense.user.id !== user.id) {
      throw new UnauthorizedException(
        'Usuário pode alterar apenas suas próprias despesas',
      );
    }
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  async getOne(id: string, user: User): Promise<Expense> {
    const expense = await this.expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException('Despensa não foi encontrada');
    }
    if (expense.user.id !== user.id) {
      throw new UnauthorizedException(
        'Usuário tem acesso apenas suas próprias despesas',
      );
    }
    return expense;
  }

  async getByUser(user: User): Promise<Expense[]> {
    return this.expenseRepository.findByUser(user);
  }

  async deleteById(id: string, user: User) {
    const expense = await this.expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException('Despensa não foi encontrada');
    }
    if (expense.user.id !== user.id) {
      throw new UnauthorizedException(
        'Usuário deletar apenas suas próprias despesas',
      );
    }
    return this.expenseRepository.remove(expense);
  }
}
