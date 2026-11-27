import { PartialType } from '@nestjs/mapped-types';
import { CreateSuscripcioneDto } from './create-suscripcione.dto.js';

export class UpdateSuscripcioneDto extends PartialType(CreateSuscripcioneDto) {}
