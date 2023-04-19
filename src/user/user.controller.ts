import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UserDecorator } from './user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDto: CreateUserDto) {
    const { email, password } = await this.authService.signup(userDto);
    return this.userService.create(email, password);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() userDto: CreateUserDto) {
    return this.authService.signin(userDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOne(@UserDecorator() user: User) {
    return this.userService.getOne(user.id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserDecorator() user: User) {
    return this.userService.deleteById(user.id);
  }
}
