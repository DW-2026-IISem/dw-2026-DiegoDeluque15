import { Sequelize } from 'sequelize-typescript';
import { EmpresaModel } from '../../../features/business/fleets/empresas/infrastructure/persistence/models/empresa.model';
import { ConductorModel } from '../../../features/business/drivers/conductores/infrastructure/persistence/models/conductor.model';
import { VehiculoModel } from '../../../features/business/fleets/vehiculos/infrastructure/persistence/models/vehiculo.model';
import { TurnoModel } from '../../../features/business/drivers/turnos/infrastructure/persistence/models/turno.model';
import { PasajeroModel } from '../../../features/business/passengers/infrastructure/persistence/models/pasajero.model';
import { TarifaModel } from '../../../features/business/pricing/infrastructure/persistence/models/tarifa.model';
import { RoleModel } from '../../../features/identity/roles/infrastructure/persistence/models/roles.model';

type SeedCounts = Record<string, number>;

async function countRows(): Promise<SeedCounts> {
  return {
    empresas: await EmpresaModel.count(),
    conductores: await ConductorModel.count(),
    vehiculos: await VehiculoModel.count(),
    turnos: await TurnoModel.count(),
    pasajeros: await PasajeroModel.count(),
    tarifas: await TarifaModel.count(),
    roles: await RoleModel.count(),
  };
}

async function seedEmpresas(): Promise<void> {
  const empresas = [
    { nit: '900111111-1', razonSocial: 'Taxis Medellín SA', contactoPrincipal: 'contacto@medellin.com' },
    { nit: '900222222-2', razonSocial: 'Cooperativa Norte', contactoPrincipal: '3001234567' },
    { nit: '900333333-3', razonSocial: 'Flota Sur Ltda', contactoPrincipal: '3009876543' },
  ];
  for (const e of empresas) {
    await EmpresaModel.findOrCreate({
      where: { nit: e.nit },
      defaults: { ...e, isActive: true },
    });
  }
}

async function seedConductores(): Promise<void> {
  const emp1 = await EmpresaModel.findOne({ where: { nit: '900111111-1' } });
  const emp2 = await EmpresaModel.findOne({ where: { nit: '900222222-2' } });

  const conductores = [
    { nombre: 'Carlos Mendoza Demo', descripcion: 'Conductor empresa Medellín', empresaId: emp1?.id ?? null },
    { nombre: 'Laura Torres Demo', descripcion: 'Conductor empresa Norte', empresaId: emp2?.id ?? null },
    { nombre: 'Pedro Independiente Demo', descripcion: 'Conductor sin empresa', empresaId: null },
  ];
  for (const c of conductores) {
    await ConductorModel.findOrCreate({
      where: { nombre: c.nombre },
      defaults: { ...c, isActive: true },
    });
  }
}

async function seedVehiculos(): Promise<void> {
  const emp1 = await EmpresaModel.findOne({ where: { nit: '900111111-1' } });
  const emp2 = await EmpresaModel.findOne({ where: { nit: '900222222-2' } });
  if (!emp1 || !emp2) return;

  const vehiculos = [
    { nombre: 'Taxi ABC-123 Demo', descripcion: 'Sedán blanco', empresaId: emp1.id },
    { nombre: 'Taxi DEF-456 Demo', descripcion: 'Sedán amarillo', empresaId: emp1.id },
    { nombre: 'Taxi GHI-789 Demo', descripcion: 'SUV', empresaId: emp2.id },
  ];
  for (const v of vehiculos) {
    await VehiculoModel.findOrCreate({
      where: { nombre: v.nombre },
      defaults: { ...v, isActive: true },
    });
  }
}

async function seedTurnos(): Promise<void> {
  const carlos = await ConductorModel.findOne({ where: { nombre: 'Carlos Mendoza Demo' } });
  const laura = await ConductorModel.findOne({ where: { nombre: 'Laura Torres Demo' } });
  const taxiAbc = await VehiculoModel.findOne({ where: { nombre: 'Taxi ABC-123 Demo' } });
  const taxiGhi = await VehiculoModel.findOne({ where: { nombre: 'Taxi GHI-789 Demo' } });
  if (!carlos || !laura || !taxiAbc || !taxiGhi) return;

  const turnos = [
    { nombre: 'Turno Mañana Carlos Demo', descripcion: 'Turno demo mañana', conductorId: carlos.id, vehiculoId: taxiAbc.id },
    { nombre: 'Turno Tarde Laura Demo', descripcion: 'Turno demo tarde', conductorId: laura.id, vehiculoId: taxiGhi.id },
  ];
  for (const t of turnos) {
    await TurnoModel.findOrCreate({
      where: { nombre: t.nombre },
      defaults: { ...t, isActive: true },
    });
  }
}

async function seedPasajeros(): Promise<void> {
  const pasajeros = [
    { nombre: 'Ana García Demo', descripcion: 'Pasajera frecuente zona norte' },
    { nombre: 'Luis Pérez Demo', descripcion: 'Pasajero corporativo' },
    { nombre: 'María López Demo', descripcion: 'Pasajera ocasional' },
  ];
  for (const p of pasajeros) {
    await PasajeroModel.findOrCreate({
      where: { nombre: p.nombre },
      defaults: { ...p, isActive: true },
    });
  }
}

async function seedTarifas(): Promise<void> {
  const today = new Date();
  const vigenciaDesde = new Date(today);
  vigenciaDesde.setMonth(today.getMonth() - 1);
  vigenciaDesde.setHours(0, 0, 0, 0);

  const vigenciaHasta = new Date(today);
  vigenciaHasta.setMonth(today.getMonth() + 6);
  vigenciaHasta.setHours(23, 59, 59, 999);

  await TarifaModel.findOrCreate({
    where: { nombre: 'Tarifa Vigente Demo' },
    defaults: {
      reglaCalculo: 'fijo',
      valorBase: 15000,
      vigenciaDesde,
      vigenciaHasta,
      isActive: true,
    },
  });
}

async function seedRoles(): Promise<void> {
  const roles = ['ADMIN', 'DESPACHO', 'CONDUCTOR', 'FINANZAS', 'SOPORTE'];
  for (const nombre of roles) {
    await RoleModel.findOrCreate({
      where: { nombre },
      defaults: { isActive: true },
    });
  }
}

export async function runSeeders(_sequelize: Sequelize): Promise<void> {
  const before = await countRows();
  console.log('[Seeders] Conteos antes:', before);

  await seedEmpresas();
  await seedConductores();
  await seedVehiculos();
  await seedTurnos();
  await seedPasajeros();
  await seedTarifas();
  await seedRoles();

  const after = await countRows();
  const delta = Object.fromEntries(
    Object.keys(after).map((k) => [k, after[k] - before[k]]),
  );
  console.log('[Seeders] Conteos después:', after);
  console.log('[Seeders] Registros nuevos en esta ejecución:', delta);
  console.log(
    '[Seeders] Idempotencia:',
    Object.values(delta).every((d) => d === 0) ? 'OK (0 duplicados)' : 'datos iniciales sembrados',
  );
}
