import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Deve ser um e-mail válido' })
  public email: string;

  @IsOptional()
  @MinLength(4, {
    message: 'A senha deve ter no mínimo 4 caracteres',
  })
  @MaxLength(4, {
    message: 'A senha deve ter no máximo 4 caracteres',
  })
  public password: number;
}
