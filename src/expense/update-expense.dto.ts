import { IsNumber, IsOptional, IsString, Max, Min, MaxLength } from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString({ message: 'A descrição deve ser em texto ' })
  @MaxLength(191)
  public description: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'O valor é um campo numérico, com limite de duas casas decimais',
    },
  )
  @Max(9999.99)
  @Min(0.1)
  public value: number;
}
