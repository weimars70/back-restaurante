import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from './entities/sector.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/usuarios/jwt/jwt.constants';
import { JwtStrategy } from 'src/usuarios/jwt/jwt.strategy';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Sector]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SectorController],
  providers: [SectorService, JwtStrategy],
})
export class SectorModule {}



