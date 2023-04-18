import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  public id: string;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ type: 'int', nullable: false })
  public password: number;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}
