
import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateSolicitudeDto {
  @IsString({
    message: 'El nombre completo debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'El nombre completo es obligatorio.',
  })
  @MaxLength(200, {
    message: 'El nombre completo no puede superar los 200 caracteres.',
  })
  nombre_completo!: string;

  @IsString({
    message: 'El DNI debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'El DNI es obligatorio.',
  })
  @MaxLength(15, {
    message: 'El DNI no puede superar los 15 caracteres.',
  })
  dni!: string;

  @IsString({
    message: 'El teléfono debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'El teléfono es obligatorio.',
  })
  @MaxLength(25, {
    message: 'El teléfono no puede superar los 25 caracteres.',
  })
  telefono!: string;
}
