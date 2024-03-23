import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'consumo' })
export class Consumo {
    @PrimaryGeneratedColumn()
    codigo: number;

    @Column({ nullable: false })
    instalacion: number;

    @Column({ nullable: true })
    lectura: number;
    
    @Column({ nullable: false })
    fecha: Date;

    @Column({ nullable: false })
    consumo: number;
    
    @Column({ nullable: false })
    mes: number;

    @Column({ nullable: false })
    year: number;

    @Column({ nullable: false })
    medidor: string;

    @Column({ nullable: false })
    lectura_anterior: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, }) 
    otros_cobros: number = 0;

    //@Column({ nullable: false })
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, }) 
    reconexion: number ;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_actualizacion: Date;

}

