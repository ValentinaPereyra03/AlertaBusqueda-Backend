import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreatePersonaDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  nombre!: string;

  @IsString({ message: 'El apellido debe ser un texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MaxLength(100, {
    message: 'El apellido no puede superar los 100 caracteres.',
  })
  apellido!: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero.' })
  @Min(0, { message: 'La edad no puede ser menor que 0.' })
  @Max(120, { message: 'La edad no puede superar los 120 años.' })
  edad?: number | null;

  @IsString({ message: 'La provincia debe ser un texto.' })
  @IsNotEmpty({ message: 'La provincia es obligatoria.' })
  @MaxLength(100, {
    message: 'La provincia no puede superar los 100 caracteres.',
  })
  provincia!: string;

  @IsOptional()
  @IsDateString({}, {
    message: 'La fecha de desaparición debe tener un formato de fecha válido.',
  })
  fecha_desaparicion?: string | null;

  @IsString({ message: 'El lugar de la última vez debe ser un texto.' })
  @IsNotEmpty({
    message: 'El lugar de la última vez es obligatorio.',
  })
  lugar_ultima_vez!: string;

  @IsString({ message: 'La descripción física debe ser un texto.' })
  @IsNotEmpty({
    message: 'La descripción física es obligatoria.',
  })
  descripcion_fisica!: string;

  @IsOptional()
  @IsString({
    message: 'La información adicional debe ser un texto.',
  })
  informacion_adicional?: string | null;

  @IsOptional()
  @IsString({
    message: 'La URL de la foto debe ser un texto.',
  })
  foto_url?: string | null;

  @IsOptional()
  @IsString({
    message: 'El estado de búsqueda debe ser un texto.',
  })
  @MaxLength(30, {
    message: 'El estado de búsqueda no puede superar los 30 caracteres.',
  })
  estado_busqueda?: string | null;
}

    





