import { Repository, EntityRepository } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../user/user.entity';

@EntityRepository(Expense)
export class ExpenseRepository extends Repository<Expense> {
  findByUser(user: User): Promise<Expense[]> {
    return this.find({ where: { user } });
  }
}
