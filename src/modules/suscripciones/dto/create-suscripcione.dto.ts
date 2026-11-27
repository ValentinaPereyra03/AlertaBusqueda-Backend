
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateSuscripcioneDto {
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

  @Type(() => Number)
  @IsInt({
    message: 'La edad debe ser un número entero.',
  })
  @Min(0, {
    message: 'La edad no puede ser menor que 0.',
  })
  @Max(120, {
    message: 'La edad no puede superar los 120 años.',
  })
  edad!: number;

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

  @IsString({
    message: 'La provincia debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'La provincia es obligatoria.',
  })
  @MaxLength(100, {
    message: 'La provincia no puede superar los 100 caracteres.',
  })
  provincia!: string;

  @IsBoolean({
    message: 'Las alertas prioritarias deben ser verdadero o falso.',
  })
  alertas_prioritarias!: boolean;

  @IsBoolean({
    message: 'La opción de menores debe ser verdadero o falso.',
  })
  menores!: boolean;

  @IsBoolean({
    message: 'La opción de adultos mayores debe ser verdadero o falso.',
  })
  adultos_mayores!: boolean;

  @IsBoolean({
    message: 'La opción de mi zona debe ser verdadero o falso.',
  })
  mi_zona!: boolean;
}
