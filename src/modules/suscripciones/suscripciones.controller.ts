import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service.js';
import { CreateSuscripcioneDto } from './dto/create-suscripcione.dto.js';
import { UpdateSuscripcioneDto } from './dto/update-suscripcione.dto.js';

@Controller('suscripciones')
export class SuscripcionesController {
  constructor(private readonly suscripcionesService: SuscripcionesService) {}

  @Post('usuario/:idUsuario')
  create(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Body() dto: CreateSuscripcioneDto,
  ) {
    return this.suscripcionesService.create(dto, idUsuario);
  }

  @Get()
  findAll() {
    return this.suscripcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSuscripcioneDto,
  ) {
    return this.suscripcionesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesService.remove(id);
  }
}
