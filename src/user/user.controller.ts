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
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.getOne(id);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.userService.getAll();
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deleteById(id);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.editById(id, userDto);
  }
}
