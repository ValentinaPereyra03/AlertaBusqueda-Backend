
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSuscripcioneDto } from './dto/create-suscripcione.dto.js';
import { UpdateSuscripcioneDto } from './dto/update-suscripcione.dto.js';

const opciones = [
  { campo: 'alertas_prioritarias', nombre: 'Alertas prioritarias' },
  { campo: 'menores', nombre: 'Búsquedas de niños y adolescentes' },
  { campo: 'adultos_mayores', nombre: 'Personas mayores' },
  { campo: 'mi_zona', nombre: 'Desapariciones en mi zona' },
] as const;

@Injectable()
export class SuscripcionesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateSuscripcioneDto, idUsuario: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario con id ${idUsuario}.`,
      );
    }

    const existente = await this.prisma.suscripcion.findUnique({
      where: { idUsuario },
    });

    if (existente) {
      throw new ConflictException(
        'El usuario ya tiene una suscripción.',
      );
    }

    const nombres = opciones
      .filter((opcion) => dto[opcion.campo] === true)
      .map((opcion) => opcion.nombre);

    const tipos = await this.prisma.tipoAlerta.findMany({
      where: { nombre: { in: nombres } },
    });

    if (tipos.length !== nombres.length) {
      throw new NotFoundException(
        'No se encontraron los tipos de alerta seleccionados.',
      );
    }

    return this.prisma.suscripcion.create({
      data: {
        idUsuario,
        edad: dto.edad,
        telefono: dto.telefono,
        provincia: dto.provincia,
        tiposAlerta: {
          create: tipos.map((tipo) => ({
            idTipo: tipo.idTipo,
          })),
        },
      },
    });
  }

  findAll() {
    return this.prisma.suscripcion.findMany();
  }

  async findOne(id: number) {
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { idSuscripcion: id },
    });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción con id ${id}.`,
      );
    }

    return suscripcion;
  }

  async update(id: number, dto: UpdateSuscripcioneDto) {
    await this.findOne(id);

    const cambios = opciones.filter(
      (opcion) => dto[opcion.campo] !== undefined,
    );

    const tipos = await this.prisma.tipoAlerta.findMany({
      where: {
        nombre: { in: cambios.map((opcion) => opcion.nombre) },
      },
    });

    if (tipos.length !== cambios.length) {
      throw new NotFoundException(
        'No se encontraron los tipos de alerta indicados.',
      );
    }

    const activar: string[] = cambios
      .filter((opcion) => dto[opcion.campo] === true)
      .map((opcion) => opcion.nombre);

    return this.prisma.suscripcion.update({
      where: { idSuscripcion: id },
      data: {
        edad: dto.edad,
        telefono: dto.telefono,
        provincia: dto.provincia,
        tiposAlerta: {
          deleteMany: {
            idTipo: { in: tipos.map((tipo) => tipo.idTipo) },
          },
          create: tipos
            .filter((tipo) => activar.includes(tipo.nombre))
            .map((tipo) => ({ idTipo: tipo.idTipo })),
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.$transaction(async (prisma) => {
      await prisma.suscripcionTipoAlerta.deleteMany({
        where: { idSuscripcion: id },
      });

      return prisma.suscripcion.delete({
        where: { idSuscripcion: id },
      });
    });
  }
}
