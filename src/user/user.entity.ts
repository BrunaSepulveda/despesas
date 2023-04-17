import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class NomeComposto {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ type: 'int', length: 8, nullable: false })
  public password: number;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}
