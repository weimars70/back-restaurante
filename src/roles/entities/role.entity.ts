import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ nullable: true })
    imagen: string;

    @Column({ nullable: false })
    route: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_actualizacion: Date;

    @ManyToMany(() => Usuario, (user) => user.roles)
    users: Usuario[];
}
