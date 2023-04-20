import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreateExpenseDto } from './create-expense.dto';
import { UpdateExpenseDto } from './update-expense.dto';

@UseGuards(AuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllByUser(@UserDecorator() user: User) {
    return this.expenseService.getByUser(user);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOneById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserDecorator() user: User,
  ) {
    return this.expenseService.getOne(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @UserDecorator() user: User,
  ) {
    return this.expenseService.create(createExpenseDto, user);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateExpense(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @UserDecorator() user: User,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExpense(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserDecorator() user: User,
  ) {
    this.expenseService.deleteById(id, user);
  }
}
