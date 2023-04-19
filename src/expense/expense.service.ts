import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { Expense } from './expense.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async getAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  async getOne(id: string): Promise<Expense> {
    return this.expenseRepository.findOne(id);
  }

  async getByUser(user: User): Promise<Expense[]> {
    return this.expenseRepository.findByUser(user);
  }
}
