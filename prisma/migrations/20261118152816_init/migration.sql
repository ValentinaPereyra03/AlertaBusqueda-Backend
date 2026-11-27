-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "personas_desaparecidas" (
    "id_persona" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "edad" SMALLINT,
    "provincia" VARCHAR(100) NOT NULL,
    "fecha_desaparicion" DATE,
    "lugar_ultima_vez" TEXT NOT NULL,
    "descripcion_fisica" TEXT NOT NULL,
    "informacion_adicional" TEXT,
    "foto_url" TEXT,
    "estado_busqueda" VARCHAR(30),

    CONSTRAINT "personas_desaparecidas_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "denunciantes" (
    "id_denunciante" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(200) NOT NULL,
    "dni" VARCHAR(15) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,

    CONSTRAINT "denunciantes_pkey" PRIMARY KEY ("id_denunciante")
);

-- CreateTable
CREATE TABLE "estados_solicitud" (
    "id_estado" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_solicitud_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "solicitudes_busqueda" (
    "id_solicitud" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_persona" INTEGER NOT NULL,
    "id_denunciante" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "fecha_solicitud" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_busqueda_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "tipos_alerta" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipos_alerta_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id_suscripcion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "edad" SMALLINT NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "fecha_suscripcion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id_suscripcion")
);

-- CreateTable
CREATE TABLE "suscripcion_tipos_alerta" (
    "id_suscripcion" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,

    CONSTRAINT "suscripcion_tipos_alerta_pkey" PRIMARY KEY ("id_suscripcion","id_tipo")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "denunciantes_dni_key" ON "denunciantes"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "estados_solicitud_nombre_key" ON "estados_solicitud"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_busqueda_id_persona_key" ON "solicitudes_busqueda"("id_persona");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_alerta_nombre_key" ON "tipos_alerta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_id_usuario_key" ON "suscripciones"("id_usuario");

-- AddForeignKey
ALTER TABLE "solicitudes_busqueda" ADD CONSTRAINT "solicitudes_busqueda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_busqueda" ADD CONSTRAINT "solicitudes_busqueda_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "personas_desaparecidas"("id_persona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_busqueda" ADD CONSTRAINT "solicitudes_busqueda_id_denunciante_fkey" FOREIGN KEY ("id_denunciante") REFERENCES "denunciantes"("id_denunciante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_busqueda" ADD CONSTRAINT "solicitudes_busqueda_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados_solicitud"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion_tipos_alerta" ADD CONSTRAINT "suscripcion_tipos_alerta_id_suscripcion_fkey" FOREIGN KEY ("id_suscripcion") REFERENCES "suscripciones"("id_suscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion_tipos_alerta" ADD CONSTRAINT "suscripcion_tipos_alerta_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipos_alerta"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;
