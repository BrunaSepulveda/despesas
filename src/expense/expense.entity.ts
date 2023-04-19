import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { NumberTransformer } from '../transformer/numberTransformer';

@Entity('expense')
export class Expense {
  @PrimaryColumn({ type: 'uuid' })
  public id: string;

  @Column({ nullable: false })
  public description: string;

  @Column({
    unique: true,
    nullable: false,
    transformer: new NumberTransformer(),
  })
  public value: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}
