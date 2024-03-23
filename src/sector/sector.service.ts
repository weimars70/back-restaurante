import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './entities/sector.entity';
import { Repository } from 'typeorm';
import { ResponseApi } from 'src/response-api/responseApi';


@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector) private sectorRepository: Repository<Sector>,
    private jwtService: JwtService

) {}

  create(createSectorDto: CreateSectorDto) {
    return 'This action adds a new sector';
  }

  async findAll() {
    let query = `SELECT codigo::text as codigo, nombre FROM public.sector;`;

    const result = await this.sectorRepository.query( query );

    console.log("Buscando service 2", result);
    if (result){
      return new ResponseApi(HttpStatus.ACCEPTED ,true,'Sectores registrados', result);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} sector`;
  }

  update(id: number, updateSectorDto: UpdateSectorDto) {
    return `This action updates a #${id} sector`;
  }

  remove(id: number) {
    return `This action removes a #${id} sector`;
  }
}
