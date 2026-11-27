## Alerta Búsqueda — Backend

API REST del proyecto académico Alerta Búsqueda, orientado al registro de personas desaparecidas, la gestión de solicitudes de búsqueda y la suscripción a alertas. Este repositorio contiene el servidor desarrollado con NestJS y TypeScript, con persistencia en PostgreSQL mediante Prisma ORM.
 ## Tecnologías
- Node.js, NestJS y TypeScript: desarrollo de la API REST.
- PostgreSQL: almacenamiento relacional de la información.
- Prisma ORM y Prisma Migrate: acceso a los datos, definición del esquema y migraciones.
- class-validator y class-transformer: validación de datos recibidos mediante DTO.
- bcrypt: generación y verificación de hashes de contraseñas.
- @nestjs/jwt: generación de JSON Web Tokens al iniciar sesión.
- Postman: ejecución y organización de solicitudes HTTP para verificar la API.
- Git y GitHub: control de versiones y colaboración mediante ramas y Pull Requests.

## Arquitectura
El backend sigue la organización modular de NestJS:
- Controller: recibe las solicitudes HTTP, obtiene parámetros y cuerpos de las peticiones, y delega al Service.
- Service: implementa la lógica de negocio y ejecuta operaciones con Prisma.
- DTO: define y valida los datos de entrada.
- Module: registra componentes y dependencias de cada funcionalidad.
- PrismaService: establece el acceso a PostgreSQL mediante Prisma Client.

Los módulos se encuentran en src/modules/: app, prisma, users, auth, personas, solicitudes y suscripciones. La aplicación configura ValidationPipe de manera global en src/main.ts y utiliza ParseIntPipe para validar los identificadores numéricos recibidos en las rutas.
Funcionalidades
Gestión de usuarios
El módulo Users implementa el CRUD completo de usuarios: registro, listado, búsqueda por ID, actualización y eliminación. Comprueba la unicidad del correo, guarda las contraseñas como hashes con bcrypt y excluye passwordHash de las respuestas. Antes de eliminar un usuario, comprueba si tiene solicitudes o suscripciones asociadas.
Autenticación
El módulo Auth permite iniciar sesión con correo electrónico y contraseña mediante POST /auth/login. Verifica la contraseña utilizando bcrypt y, cuando las credenciales son válidas, devuelve un token JWT y los datos básicos del usuario. El registro se realiza mediante POST /users, evitando dos endpoints de creación.
Personas desaparecidas
El módulo Personas permite crear, consultar, modificar y eliminar registros. Gestiona datos de identificación, provincia, fecha y lugar de desaparición, descripción física y otros campos definidos en su DTO y modelo de Prisma.
Solicitudes de búsqueda
El módulo Solicitudes relaciona un usuario, una persona desaparecida, un denunciante y un estado. Al crear una solicitud, el Service busca el estado Pendiente, registra o reutiliza al denunciante según su DNI y guarda las claves foráneas. El modelo establece una solicitud como máximo por persona desaparecida.
Suscripciones a alertas
El módulo Suscripciones administra suscripciones vinculadas a usuarios. Permite seleccionar preferencias de alerta; estas se representan mediante las tablas tipos_alerta y suscripcion_tipos_alerta. El modelo establece una suscripción como máximo por usuario. El nombre completo se recibe para validación en el DTO, pero no se almacena como columna de suscripciones.
Base de datos
La base de datos PostgreSQL se modela de forma relacional y normalizada hasta tercera forma normal (3FN). El esquema se encuentra en prisma/schema.prisma y contiene las siguientes entidades:
Modelo Prisma	Tabla PostgreSQL	Propósito
Usuario	usuarios	Cuentas registradas
PersonaDesaparecida	personas_desaparecidas	Personas registradas para búsqueda
Denunciante	denunciantes	Datos de los denunciantes
EstadoSolicitud	estados_solicitud	Estados de las solicitudes
SolicitudBusqueda	solicitudes_busqueda	Relación entre usuario, persona, denunciante y estado
Suscripcion	suscripciones	Suscripciones vinculadas a usuarios
TipoAlerta	tipos_alerta	Tipos de alertas disponibles
SuscripcionTipoAlerta	suscripcion_tipos_alerta	Relación entre suscripciones y tipos de alerta


Las relaciones se definen mediante claves primarias, foráneas y restricciones de unicidad. Los cambios estructurales se gestionan con migraciones de Prisma.
Endpoints
Usuarios
Método	Ruta	Operación
POST	/users	Registrar usuario
GET	/users	Listar usuarios
GET	/users/:id	Buscar usuario por ID
PATCH	/users/:id	Actualizar usuario
DELETE	/users/:id	Eliminar usuario


## Autenticación
Método	Ruta	Operación
POST	/auth/login	Validar credenciales y generar JWT


## Personas desaparecidas
Método	Ruta	Operación
POST	/personas	Registrar persona
GET	/personas	Listar personas
GET	/personas/:id	Buscar persona por ID
PATCH	/personas/:id	Actualizar persona
DELETE	/personas/:id	Eliminar persona


## Solicitudes de búsqueda
Método	Ruta	Operación
POST	/solicitudes/usuario/:idUsuario/persona/:idPersona	Registrar solicitud
GET	/solicitudes	Listar solicitudes
GET	/solicitudes/:id	Buscar solicitud por ID
PATCH	/solicitudes/:id	Actualizar datos del denunciante asociado
DELETE	/solicitudes/:id	Eliminar solicitud


## Suscripciones
Método	Ruta	Operación
POST	/suscripciones/usuario/:idUsuario	Registrar suscripción
GET	/suscripciones	Listar suscripciones
GET	/suscripciones/:id	Buscar suscripción por ID
PATCH	/suscripciones/:id	Actualizar suscripción y preferencias
DELETE	/suscripciones/:id	Eliminar suscripción


Instalación y ejecución local
Requisitos
Tener instalados Node.js, npm y PostgreSQL, y contar con una base de datos local para el proyecto.
# Clonar el repositorio
git clone https://github.com/ValentinaPereyra03/AlertaBusqueda-Backend.git
cd AlertaBusqueda-Backend
git switch dev

# Instalar dependencias
npm install
Crear un archivo .env en la raíz del proyecto con valores propios del entorno:
PORT=3000
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/alerta_busqueda_db
JWT_SECRET=reemplazar_por_una_clave_secreta_larga_y_segura
API_BASE_URL=http://localhost:3000
El archivo .env contiene información sensible y no debe subirse a GitHub.

# Aplicar las migraciones existentes
npx prisma migrate deploy

# Generar Prisma Client
npx prisma generate

# Iniciar el servidor en modo desarrollo
npm run start:dev

# Comprobar la compilación
npm run build
El servidor utiliza el puerto configurado en PORT o el puerto 3000 si esa variable no está definida.
Datos iniciales de referencia
Para utilizar las funcionalidades de Solicitudes y Suscripciones, las tablas estados_solicitud y tipos_alerta deben contener los valores que consultan los Services. En una base de datos nueva, estas inserciones se pueden ejecutar una sola vez, por ejemplo desde pgAdmin:
INSERT INTO estados_solicitud (nombre)
VALUES ('Pendiente'), ('Aprobada'), ('Rechazada');

INSERT INTO tipos_alerta (nombre)
VALUES
  ('Alertas prioritarias'),
  ('Búsquedas de niños y adolescentes'),
  ('Personas mayores'),
  ('Desapariciones en mi zona');
Estos registros son datos de referencia; su inserción no modifica la estructura de las tablas. Si ya existen, no se deben insertar nuevamente con estas instrucciones.
Verificación de la API con Postman
Para verificar la API de manera independiente del frontend se utiliza la colección Alerta Búsqueda - Backend, organizada por módulos: Personas, Users, Solicitudes y Suscripciones.

Durante las pruebas manuales se han ejecutado solicitudes HTTP para registrar, consultar, actualizar y eliminar usuarios y suscripciones, así como para crear y listar solicitudes de búsqueda y consultar personas desaparecidas. Entre las respuestas observadas están 201 Created, 200 OK, 400 Bad Request, 404 Not Found y 409 Conflict, según el caso.

Postman actúa como cliente HTTP: envía solicitudes a los Controllers de NestJS; los Services aplican la lógica y Prisma opera sobre PostgreSQL. Posteriormente, el frontend en React podrá consumir los mismos endpoints mediante Axios.
Ejemplos de solicitudes
Registrar usuario — POST /users
{
  "nombre": "Lucia",
  "apellido": "Fernandez",
  "correo": "lucia.ejemplo@example.com",
  "password": "Prueba1234"
}
Registrar suscripción — POST /suscripciones/usuario/1
{
  "nombre_completo": "Lucia Fernandez",
  "edad": 24,
  "telefono": "3814567890",
  "provincia": "Tucumán",
  "alertas_prioritarias": true,
  "menores": false,
  "adultos_mayores": false,
  "mi_zona": true
}
Registrar solicitud — POST /solicitudes/usuario/1/persona/1
{
  "nombre_completo": "Mariana Perez",
  "dni": "34567890",
  "telefono": "3814567890"
}
Los identificadores son ilustrativos y deben corresponder a registros existentes en la base de datos local.
Validaciones y manejo de errores
La API utiliza DTO y ValidationPipe para validar los datos recibidos. Los identificadores de las rutas se procesan con ParseIntPipe.

Los Services utilizan excepciones de NestJS para comunicar errores de validación, registros inexistentes, credenciales inválidas y conflictos, incluidos correos duplicados o relaciones que impiden una eliminación.
Flujo de trabajo con Git
El desarrollo se organiza con las ramas main (principal), dev (integración), feature/* (funcionalidades), fix/* (correcciones), refactor/* (reorganización) y docs/* (documentación). Los cambios se integran mediante commits descriptivos y Pull Requests. El historial del repositorio permite consultar la evolución del backend.
Repositorios relacionados
- Backend: https://github.com/ValentinaPereyra03/AlertaBusqueda-Backend
- Frontend: https://github.com/IgnacioRosconi/AlertaBusqueda-frontend
El frontend está desarrollado con React y Vite; las pruebas actuales de esta API se realizan mediante Postman como cliente HTTP independiente.