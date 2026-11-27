
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto.js';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto.js';

@Injectable()
export class SolicitudesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateSolicitudeDto,
    idUsuario?: number,
    idPersona?: number,
  ) {
    if (idUsuario === undefined || idPersona === undefined) {
      throw new BadRequestException(
        'Se requiere el usuario y la persona desaparecida.',
      );
    }

    await this.validatePersona(idPersona);

    const estado = await this.prisma.estadoSolicitud.findUnique({
      where: { nombre: 'Pendiente' },
    });

    if (!estado) {
      throw new NotFoundException(
        'No existe el estado Pendiente.',
      );
    }

    const denunciante = await this.prisma.denunciante.upsert({
      where: { dni: dto.dni },
      update: {},
      create: {
        nombreCompleto: dto.nombre_completo,
        dni: dto.dni,
        telefono: dto.telefono,
      },
    });

    return this.prisma.solicitudBusqueda.create({
      data: {
        idUsuario,
        idPersona,
        idDenunciante: denunciante.idDenunciante,
        idEstado: estado.idEstado,
      },
    });
  }

  findAll() {
    return this.prisma.solicitudBusqueda.findMany();
  }

  async findOne(id: number) {
    const solicitud = await this.prisma.solicitudBusqueda.findUnique({
      where: { idSolicitud: id },
    });

    if (!solicitud) {
      throw new NotFoundException(
        `No existe una solicitud con id ${id}.`,
      );
    }

    return solicitud;
  }

  async update(id: number, dto: UpdateSolicitudeDto) {
    await this.findOne(id);

    return this.prisma.solicitudBusqueda.update({
      where: { idSolicitud: id },
      data: {
        denunciante: {
          update: {
            nombreCompleto: dto.nombre_completo,
            dni: dto.dni,
            telefono: dto.telefono,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.solicitudBusqueda.delete({
      where: { idSolicitud: id },
    });
  }

  private async validatePersona(idPersona: number) {
    const solicitud = await this.prisma.solicitudBusqueda.findUnique({
      where: { idPersona },
    });

    if (solicitud) {
      throw new ConflictException(
        'Ya existe una solicitud para esta persona.',
      );
    }
  }
}
