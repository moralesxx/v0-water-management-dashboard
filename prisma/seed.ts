// prisma/seed.ts
// Datos iniciales para el SISTEMA v1.0.0
// Ejecutar con: npx prisma db seed

import { PrismaClient, Rol, EstadoServicio } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de SISTEMA...");

  // ─── Sectores ─────────────────────────────────────────────────────────────
  const sectores = await Promise.all([
    prisma.sector.upsert({
      where: { nombre: "Sector A" },
      update: {},
      create: { nombre: "Sector A", descripcion: "Zona norte de la comunidad" },
    }),
    prisma.sector.upsert({
      where: { nombre: "Sector B" },
      update: {},
      create: { nombre: "Sector B", descripcion: "Zona sur de la comunidad" },
    }),
    prisma.sector.upsert({
      where: { nombre: "Sector C" },
      update: {},
      create: { nombre: "Sector C", descripcion: "Zona central de la comunidad" },
    }),
  ]);

  console.log(`${sectores.length} sectores creados`);

  // ─── Usuario Administrador ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Administrador del Sistema ",
      email: "admin@sanmiguel.com",
      passwordHash: adminPassword,
      rol: Rol.ADMIN,
    },
  });
  console.log(`Admin creado: ${admin.email}`);

  // ─── Usuario Tesorero ─────────────────────────────────────────────────────
  const tesoreroPassword = await bcrypt.hash("Tesorero123!", 10);
  const tesorero = await prisma.usuario.upsert({
    where: { email: "tesorero@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Carlos Mendoza",
      email: "tesorero@sanmiguel.com",
      passwordHash: tesoreroPassword,
      rol: Rol.TESORERO,
    },
  });
  console.log(`Tesorero creado: ${tesorero.email}`);

  // ─── Usuario Encargado de Distribución ───────────────────────────────────
  const encargadoPassword = await bcrypt.hash("Encargado123!", 10);
  const encargado = await prisma.usuario.upsert({
    where: { email: "encargado@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Luis García",
      email: "encargado@sanmiguel.com",
      passwordHash: encargadoPassword,
      rol: Rol.ENCARGADO,
    },
  });
  console.log(`Encargado creado: ${encargado.email}`);

  // ─── Usuario Familia de ejemplo ───────────────────────────────────────────
  const familiaPassword = await bcrypt.hash("Familia123!", 10);
  const usuarioFamilia = await prisma.usuario.upsert({
    where: { email: "familia.perez@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Juan Pérez",
      email: "familia.perez@sanmiguel.com",
      passwordHash: familiaPassword,
      rol: Rol.FAMILIA,
    },
  });

  await prisma.familia.upsert({
    where: { usuarioId: usuarioFamilia.id },
    update: {},
    create: {
      codigoFamilia: "FAM-001",
      nombreRepresentante: "Juan Pérez",
      direccion: "Calle Principal #12",
      telefono: "5555-1234",
      estadoServicio: EstadoServicio.ACTIVO,
      usuarioId: usuarioFamilia.id,
      sectorId: sectores[0].id,
    },
  });
  console.log(`Familia de ejemplo creada: FAM-001`);

  // ─── Configuración inicial del tanque ─────────────────────────────────────
  const tanqueExistente = await prisma.configuracionTanque.findFirst();
  if (!tanqueExistente) {
    await prisma.configuracionTanque.create({
      data: {
        capacidadLitros: 50000,
        umbralAlerta: 20,
      },
    });
    console.log("Configuración del tanque creada (50,000 L, alerta al 20%)");
  }

  console.log("\nSeed completado exitosamente.");
  console.log("\nCredenciales de acceso:");
  console.log("   Admin:     admin@sanmiguel.com     / Admin123!");
  console.log("   Tesorero:  tesorero@sanmiguel.com  / Tesorero123!");
  console.log("   Encargado: encargado@sanmiguel.com / Encargado123!");
  console.log("   Familia:   familia.perez@sanmiguel.com / Familia123!");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
