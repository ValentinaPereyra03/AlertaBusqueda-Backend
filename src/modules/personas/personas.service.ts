import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';

@Injectable()
export class PersonasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePersonaDto) {
    return this.prisma.personaDesaparecida.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        edad: dto.edad,
        provincia: dto.provincia,
        fechaDesaparicion: dto.fecha_desaparicion
          ? new Date(dto.fecha_desaparicion)
          : null,
        lugarUltimaVez: dto.lugar_ultima_vez,
        descripcionFisica: dto.descripcion_fisica,
        informacionAdicional: dto.informacion_adicional,
        fotoUrl: dto.foto_url,
        estadoBusqueda: dto.estado_busqueda,
      },
    });
  }

  findAll() {
    return this.prisma.personaDesaparecida.findMany();
  }

  async findOne(id: number) {
    const persona = await this.prisma.personaDesaparecida.findUnique({
      where: { idPersona: id },
    });

    if (!persona) {
      throw new NotFoundException(
        `No existe una persona con id ${id}.`,
      );
    }

    return persona;
  }

  async update(id: number, dto: UpdatePersonaDto) {
    await this.findOne(id);

    return this.prisma.personaDesaparecida.update({
      where: { idPersona: id },
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        edad: dto.edad,
        provincia: dto.provincia,
        fechaDesaparicion:
          dto.fecha_desaparicion === undefined
            ? undefined
            : dto.fecha_desaparicion === null
              ? null
              : new Date(dto.fecha_desaparicion),
        lugarUltimaVez: dto.lugar_ultima_vez,
        descripcionFisica: dto.descripcion_fisica,
        informacionAdicional: dto.informacion_adicional,
        fotoUrl: dto.foto_url,
        estadoBusqueda: dto.estado_busqueda,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.validateNoSolicitud(id);

    return this.prisma.personaDesaparecida.delete({
      where: { idPersona: id },
    });
  }

  private async validateNoSolicitud(idPersona: number) {
    const solicitud = await this.prisma.solicitudBusqueda.findUnique({
      where: { idPersona },
      select: { idSolicitud: true },
    });

    if (solicitud) {
      throw new ConflictException(
        'No se puede eliminar la persona porque tiene una solicitud de búsqueda asociada.',
      );
    }
  }
}
