import { Injectable } from '@nestjs/common';
import { CreateSuscripcioneDto } from './dto/create-suscripcione.dto.js';
import { UpdateSuscripcioneDto } from './dto/update-suscripcione.dto.js';

@Injectable()
export class SuscripcionesService {
  create(createSuscripcioneDto: CreateSuscripcioneDto) {
    return 'This action adds a new suscripcione';
  }

  findAll() {
    return `This action returns all suscripciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} suscripcione`;
  }

  update(id: number, updateSuscripcioneDto: UpdateSuscripcioneDto) {
    return `This action updates a #${id} suscripcione`;
  }

  remove(id: number) {
    return `This action removes a #${id} suscripcione`;
  }
}
