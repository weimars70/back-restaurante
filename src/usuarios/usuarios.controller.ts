import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRolesGuard } from './jwt/jwt-roles.guard';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}
  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Post('login')
  getLogin( @Body() loginAuthDto : LoginAuthDto)   {
    return this.usuariosService.login(loginAuthDto);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll(@Query() _params : any) {
    return this.usuariosService.findAll(_params);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(id);
  }
}
//163.123.181.180