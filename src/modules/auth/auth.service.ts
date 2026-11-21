import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAuthDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (
      !usuario ||
      !usuario.passwordHash ||
      !(await compare(dto.password, usuario.passwordHash))
    ) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.idUsuario,
      correo: usuario.correo,
    });

    return {
      access_token: accessToken,
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
      },
    };
  }
}
