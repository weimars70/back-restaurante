import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/usuarios/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/usuarios/jwt/jwt-roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
