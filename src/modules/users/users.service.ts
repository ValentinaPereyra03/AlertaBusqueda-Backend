import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un usuario con ese correo electrónico.',
      );
    }

    const passwordHash = await hash(dto.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        correo: dto.correo,
        passwordHash,
      },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fechaRegistro: true,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fechaRegistro: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fechaRegistro: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario con id ${id}.`,
      );
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.correo) {
      const existente = await this.prisma.usuario.findUnique({
        where: { correo: dto.correo },
      });

      if (existente && existente.idUsuario !== id) {
        throw new ConflictException(
          'Ya existe un usuario con ese correo electrónico.',
        );
      }
    }

    return this.prisma.usuario.update({
      where: { idUsuario: id },
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        correo: dto.correo,
      },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fechaRegistro: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const solicitud = await this.prisma.solicitudBusqueda.findFirst({
      where: { idUsuario: id },
    });

    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { idUsuario: id },
    });

    if (solicitud || suscripcion) {
      throw new ConflictException(
        'No se puede eliminar el usuario porque tiene solicitudes o suscripciones asociadas.',
      );
    }

    return this.prisma.usuario.delete({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        fechaRegistro: true,
      },
    });
  }
}
