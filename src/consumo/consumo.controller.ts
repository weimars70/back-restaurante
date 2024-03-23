import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';
import { JwtAuthGuard } from 'src/usuarios/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/usuarios/jwt/jwt-roles.guard';

@Controller('consumo')
export class ConsumoController {
  constructor(private readonly consumoService: ConsumoService) {}

  @Get('buscarLecturas')
  findAll(@Query() _params : any) {
    return this.consumoService.findAll(_params);
  }

  @Get('instalacion')
  findInstalacion( @Query() _params : any ) {
    console.log("instalacion", _params);
    return this.consumoService.findinstalacion(_params);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createConsumoDto: CreateConsumoDto) {
    //console.log("Create", createConsumoDto);
    return this.consumoService.create(createConsumoDto);
  }

  @Post('updatelecturaspendientes')
  updateLecturasPendientes(@Body() _params : any) {
    //console.log("Create", createConsumoDto);
    return this.consumoService.updateLecturas(_params);
  }

  @Post('crearlecturas')
  createLecturasPendientes(@Body() _params : any) {
    console.log("Create", _params);
    return this.consumoService.createLecturasPendientes(_params);
  }

  

  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('consumo')
  getconsumo( @Query() _params : any)   {
    return this.consumoService.getconsumo(_params);
  }

  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  
  
  //@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumoService.findOne(+id);
  }

  
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsumoDto: UpdateConsumoDto) {
    return this.consumoService.update(+id, updateConsumoDto);
  }

  /*@UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.consumoService.remove(id);
  }*/
}


