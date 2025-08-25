import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) { }

  @Post('create')
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  // @Get(':id')
  // findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.users.findById(id);
  // }

  // @Get()
  // findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
  //   return this.users.paginate({ page: +page, limit: +limit });
  // }
}
