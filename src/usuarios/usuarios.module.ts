import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { jwtConstants } from './jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Role } from 'src/roles/entities/role.entity';


@Module({
  imports: [ 
    TypeOrmModule.forFeature([Usuario, Role]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtStrategy]
})
export class UsuariosModule {}
