import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { PersonasModule } from '../personas/personas.module.js';
import { SolicitudesModule } from '../solicitudes/solicitudes.module.js';
import { SuscripcionesModule } from '../suscripciones/suscripciones.module.js';

@Module({
  imports: [UsersModule, AuthModule, PersonasModule, SolicitudesModule, SuscripcionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
