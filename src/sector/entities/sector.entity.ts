
import { Column,  Entity,  PrimaryColumn } from "typeorm";

@Entity({ name: 'sector' })
export class Sector {
    @PrimaryColumn({ unique: true })
    codigo: number;

    @Column({ unique: true })
    nombre: string;   
}
