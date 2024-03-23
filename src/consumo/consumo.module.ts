import { Module } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { ConsumoController } from './consumo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumo } from './entities/consumo.entity';
import { JwtStrategy } from 'src/usuarios/jwt/jwt.strategy';

@Module({
  imports: [ TypeOrmModule.forFeature([Consumo]) ],
  controllers: [ConsumoController],
  providers: [ConsumoService, JwtStrategy]
})
export class ConsumoModule {}
