import { Decimal128 } from "typeorm";

export class CreateConsumoDto {
    instalacion: number;
    fecha: Date;
    mes: number;
    year: number;
    medidor: string;
    lectura: number;
    lectura_anterior: number;
    consumo: number;
    reconexion: number;
    otros_cobros: number;
}
