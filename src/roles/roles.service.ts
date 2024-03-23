import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseApi } from '../response-api/responseApi';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    
) {}
  async create(rol: CreateRoleDto) {
    const rolExist = await this.roleRepository.findOneBy({ nombre: rol.nombre })

    if (rolExist) {
      return new ResponseApi(HttpStatus.CONFLICT,false,'El rol ya esta registrado',rol);
    }
    const newRol = await this.roleRepository.save(this.roleRepository.create(rol));
    
    return new ResponseApi(HttpStatus.CREATED,true,'Rol Registrado',newRol);
    
  }

  async findAll() {
    const result = await this.roleRepository.find();
    if (result){
      return new ResponseApi(HttpStatus.ACCEPTED ,false,'Roles registrados', result);
    }
  }
    
  async findOne(id: string) {
    const rolFound = await this.roleRepository.findOneBy({id: id});
    if (!rolFound) {
      return new ResponseApi(HttpStatus.NOT_FOUND ,false,'Error rol no encontrado', {});
    };
    return  new ResponseApi( HttpStatus.FORBIDDEN , false, 'Rol encontrado', rolFound);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const userFound = await this.roleRepository.findOneBy({id: id});

    if (!userFound) {
      return  new ResponseApi( HttpStatus.NOT_FOUND , false, 'Error Actualizando Rol ', updateRoleDto);
    }

    const updatedRol = Object.assign(userFound, updateRoleDto);
    this.roleRepository.save(updatedRol);
    
    return  new ResponseApi(HttpStatus.ACCEPTED,true,'Rol Actualizado',updatedRol);
  }

  async remove(id: number) { return new ResponseApi(HttpStatus.NOT_FOUND, false, 'No implementado', {})}

}
