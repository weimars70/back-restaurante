import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { Role } from "src/roles/entities/role.entity";


@Entity({ name: 'usuarios' })
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
    
    @Column()
    apellido: string;

    @Column({ unique: true })
    email: string;
    
    @Column({ unique: true })
    telefono: string;

    @Column({ select: true })
    clave: string;
    
    @Column({ nullable: true })
    notification_token: string;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_actualizacion: Date;

    

    @JoinTable({
        name: 'usuarios_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })

    @ManyToMany(() => Role, (rol) => rol.users)
    roles: Role[];

    @BeforeInsert()
    async hashPassword() {
        this.clave = await hash(this.clave, Number(process.env.HASH_SALT));
    }
}

