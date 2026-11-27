import { Module } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service.js';
import { SuscripcionesController } from './suscripciones.controller.js';

@Module({
  controllers: [SuscripcionesController],
  providers: [SuscripcionesService],
})
export class SuscripcionesModule {}
