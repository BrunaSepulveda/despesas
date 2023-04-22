import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'Deve ser um e-mail válido' })
  public email: string;

  @IsNotEmpty({ message: 'senha é obrigatório' })
  public password: number;
}
