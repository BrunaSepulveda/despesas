import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ where: { email } });
  }
}
