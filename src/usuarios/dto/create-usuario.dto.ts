export class CreateUsuarioDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    clave: string;
    image?: string;
    notification_token?: string;
    rolesIds: String[];
}
