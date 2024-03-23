import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { JwtStrategy } from 'src/usuarios/jwt/jwt.strategy';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Role, Usuario]) ],
  controllers: [RolesController],
  providers: [RolesService, JwtStrategy]
})
export class RolesModule {}
