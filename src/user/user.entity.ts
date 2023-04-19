import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Expense } from '../expense/expense.entity';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  public id: string;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ type: 'int', nullable: false })
  public password: number;

  @OneToMany(() => Expense, (expense) => expense.id)
  public expenses: Expense[];

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}
