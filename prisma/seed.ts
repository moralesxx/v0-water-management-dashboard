// prisma/seed.ts
import { PrismaClient, Rol, EstadoServicio } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

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
  console.log(`✓ ${sectores.length} sectores creados`);

  // ─── Admin ────────────────────────────────────────────────────────────────
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Administrador del Sistema",
      email: "admin@sanmiguel.com",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      rol: Rol.ADMIN,
    },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // ─── Tesorero ─────────────────────────────────────────────────────────────
  const tesorero = await prisma.usuario.upsert({
    where: { email: "tesorero@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Carlos Mendoza",
      email: "tesorero@sanmiguel.com",
      passwordHash: await bcrypt.hash("Tesorero123!", 10),
      rol: Rol.TESORERO,
    },
  });
  console.log(`✓ Tesorero: ${tesorero.email}`);

  // ─── Encargado ────────────────────────────────────────────────────────────
  const encargado = await prisma.usuario.upsert({
    where: { email: "encargado@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Luis García",
      email: "encargado@sanmiguel.com",
      passwordHash: await bcrypt.hash("Encargado123!", 10),
      rol: Rol.ENCARGADO,
    },
  });
  console.log(`✓ Encargado: ${encargado.email}`);

  // ─── Familia ──────────────────────────────────────────────────────────────
  const usuarioFamilia = await prisma.usuario.upsert({
    where: { email: "familia.perez@sanmiguel.com" },
    update: {},
    create: {
      nombre: "Juan Pérez",
      email: "familia.perez@sanmiguel.com",
      passwordHash: await bcrypt.hash("Familia123!", 10),
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
  console.log(`✓ Familia FAM-001 creada`);

  // ─── Tanque ───────────────────────────────────────────────────────────────
  const tanqueExistente = await prisma.configuracionTanque.findFirst();
  if (!tanqueExistente) {
    await prisma.configuracionTanque.create({
      data: { capacidadLitros: 50000, umbralAlerta: 20 },
    });
    console.log("✓ Tanque configurado (50,000 L, alerta 20%)");
  }

  console.log("\n✅ Seed completado.");
  console.log("\nCredenciales:");
  console.log("  admin@sanmiguel.com        / Admin123!");
  console.log("  tesorero@sanmiguel.com     / Tesorero123!");
  console.log("  encargado@sanmiguel.com    / Encargado123!");
  console.log("  familia.perez@sanmiguel.com / Familia123!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });