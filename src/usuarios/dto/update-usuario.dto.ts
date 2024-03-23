import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    clave?: string;
    image?: string;
    notification_token?: string;
}
