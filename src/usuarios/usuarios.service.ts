import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseApi } from '../response-api/responseApi';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/entities/role.entity';
import { NEVER } from 'rxjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { resourceUsage } from 'process';
import { SqlInMemory } from 'typeorm/driver/SqlInMemory';
import { use } from 'passport';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usersRepository: Repository<Usuario>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwtService: JwtService

) {}


//Crear Usuario
  async create(user: CreateUsuarioDto) {
    console.log('datos front: ', user);
    
      const emailExist = await this.usersRepository.find({where: {
        email: user.email
        }});
  
        if (emailExist.length>0) {
            return new ResponseApi(HttpStatus.CONFLICT,false,'Ya existe un usuario con este email registrado', user);
        }

        const phoneExist = await this.usersRepository.findOneBy({telefono: user.telefono});

        if (phoneExist) {
          return new ResponseApi(HttpStatus.CONFLICT,false,'Ya existe un usuario con este teléfono registrado', user);
        }
        
        const newUser = await this.usersRepository.create(user); 


        let rolesIds = [];
        
        if (user.rolesIds !== undefined && user.rolesIds !== null) { // DATA
            rolesIds = user.rolesIds;
        }
        else {
            rolesIds.push('CLIENT')
        }
        
        const roles = await this.roleRepository.findBy({ id: In(rolesIds) });
        newUser.roles = roles;
        const userSaved = await this.usersRepository.save(newUser);
        const rolesString = newUser.roles.map(rol => rol.id); //['CLIENT', 'ADMIN']
        const payload = { id: newUser.id, name: newUser.nombre, roles: rolesString };
        const token = this.jwtService.sign(payload);
        newUser.notification_token=token;
  
        return new ResponseApi(HttpStatus.CREATED, true, 'Usuario registrado', userSaved);
  }

  //buscar todos
  async findAll(_params: any ) {
    //const result = await this.usersRepository.find();
    //console.log("Result: ",result);
    
    //return new ResponseApi(HttpStatus.ACCEPTED, true, 'Consulta exitosa de todos los usuario', result);
    let query = `SELECT id::text as id, nombre, apellido,email,telefono::text as telefono FROM public.usuarios where 1=1`;

    for (let i = 0; i < Object.keys(_params).length; i++) {
      const propiedad = Object.keys(_params)[i];
      if (_params[propiedad] != '' && _params[propiedad] != null){
        query = query + ` and `+ propiedad.toLowerCase() +`::text like '%`+ _params[propiedad].toLowerCase()+ `%'`;
      }
    } 
    query = query + ` order by id `;

    console.log('query', query);
    const result = await this.usersRepository.query( query );
  
    if (result.length == 0){
      return new ResponseApi(HttpStatus.ACCEPTED, false, '', result);
    }else{
      console.log('consultando todos', result);
      return new ResponseApi(HttpStatus.ACCEPTED, true, 'Data retornada', result); 
    }

  }

  //busacr uno
  async findOne(id: number) {
    const userFound = await this.usersRepository.findOneBy({id: id});

    if (!userFound) {
      return new ResponseApi(HttpStatus.NOT_FOUND ,false,'Error: usuario no encontrado ', userFound);
    };

    return new ResponseApi(HttpStatus.ACCEPTED, true, 'Consulta exitosa', userFound);
  }

  //actualizar
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    const userFound = await this.usersRepository.findOneBy({id: id});

    if (!userFound) {
      return new ResponseApi(HttpStatus.CONFLICT,false,'Usuario no existe', updateUsuarioDto);
    }

    const updatedUser = Object.assign(userFound, updateUsuarioDto);
    this.usersRepository.save(updatedUser);

    return  new ResponseApi(HttpStatus.ACCEPTED,true,'Usuario Actualizado correctamente', updatedUser);
  }

  async remove(id: number) { 
    const userDelete = await this.usersRepository.findOneBy({id: id});
    if(!userDelete){
      return new ResponseApi(HttpStatus.NOT_FOUND, false, 'Usuario no encontrado', {});
    }
    this.usersRepository.delete(id);
      return  new ResponseApi(HttpStatus.ACCEPTED,true,'El usuario se eliminó correctamente', userDelete);
  }

  
  async login(loginAuthDto : LoginAuthDto ){
    
    const result  = await this.usersRepository.findOneBy ({email: loginAuthDto.email});
    //console.log('result email: ', result);

    if (!result) {
        console.log('loginData: ', loginAuthDto);
        //throw new HttpException('El email o usuario no existe', HttpStatus.NOT_FOUND);
        return new ResponseApi(HttpStatus.ACCEPTED, false, 'EMAIL NO EXISTE', {}); 
    }
    
    const roles = await this.roleRepository.query( "select id,nombre,route from roles where id in ( select id_rol from  usuarios_roles where id_user = "+ result.id+")");

    const isPasswordValid = await compare(loginAuthDto.clave, result.clave);
    if (!isPasswordValid) {
        console.log('PASSWORD INCORRECTO');
        return new ResponseApi(HttpStatus.ACCEPTED, false, 'CLAVE INCORRECTA', {}); 
    }
    else{
      delete result.clave;
      
      const payload = { 
        id: result.id.toString, 
        name: result.nombre,
        roles: roles
       };
   
      result.roles = roles;

      const token = this.jwtService.sign(payload);
      
      result.notification_token = 'Bearer ' + token;
      const data = {
          success: true,
          message: 'El usuario fue autenticado',
          data: result,
          token: 'Bearer ' + token
      };
      return new ResponseApi(HttpStatus.ACCEPTED, true, 'Usuario Logeado', data); 
    }
  }



}
