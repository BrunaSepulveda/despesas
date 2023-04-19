import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as _srcypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/create-user.dto';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_srcypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async passwordInHash(password: string, salt: string): Promise<string> {
    // gera uma hash de 32 caracteres
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return hash.toString('hex');
  }

  async signup(userDto: CreateUserDto) {
    const userFound = await this.userService.getByEmail(userDto.email);
    if (userFound) {
      throw new BadRequestException('Usuário já cadastrado');
    }
    // gera uma chave de 16 caracteres
    const salt = randomBytes(8).toString('hex');
    const hash = await this.passwordInHash(`${userDto.password}`, salt);
    const result = salt + '.' + hash;
    return { email: userDto.email, password: result };
  }

  async signin(userDto: CreateUserDto) {
    const user = await this.userService.getByEmail(userDto.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const [salt, hash] = user.password.split('.');

    const hashPassword = await this.passwordInHash(`${userDto.password}`, salt);

    if (hash !== hashPassword) {
      throw new UnauthorizedException('Sem autorização');
    } else {
      return {
        access_token: await this.jwtService.signAsync({
          id: user.id,
          email: user.email,
        }),
      };
    }
  }
}
