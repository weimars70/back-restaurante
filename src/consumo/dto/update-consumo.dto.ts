import { PartialType } from '@nestjs/swagger';
import { CreateConsumoDto } from './create-consumo.dto';

export class UpdateConsumoDto extends PartialType(CreateConsumoDto) {
    instalacion: number;
    fecha: Date;
    mes: number;
    year: number;
    medidor: string;
    lectura_actual: number;
    lectura_anterior: number;
    consumo: number;
    reconexion: number;
    otros_cobros: number;
}
