import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { ConsumoModule } from './consumo/consumo.module';
import { PersonasModule } from './personas/personas.module';
import { SectorModule } from './sector/sector.module';


ConfigModule.forRoot();

//const ruta =__dirname + '/**/**/*.entity{.ts,.js}';
//console.log('ruta: ', ruta);



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsuariosModule,
    RolesModule,
    ConsumoModule,
    PersonasModule,
    SectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



