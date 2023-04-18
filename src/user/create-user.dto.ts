import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'Deve ser um e-mail válido' })
  public email: string;

  @IsNotEmpty({ message: 'senha é obrigatório' })
  @MinLength(4, {
    message: 'A senha deve ter no mínimo 4 caracteres',
  })
  @MaxLength(4, {
    message: 'A senha deve ter no máximo 4 caracteres',
  })
  public password: number;
}
