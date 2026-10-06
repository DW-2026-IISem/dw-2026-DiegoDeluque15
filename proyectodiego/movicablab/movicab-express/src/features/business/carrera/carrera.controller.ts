import { Request, Response } from "express";
import { Carrera, CarreraEstado, CarreraI } from "./carrera.model";
import { Pasajero } from "../pasajero/pasajero.model";
import { Turno } from "../turno/turno.model";
import { Tarifa } from "../tarifa/tarifa.model";

/* ── Mapa de transiciones válidas ── */
const TRANSITIONS: Record<CarreraEstado, CarreraEstado[]> = {
  solicitada: ["aceptada", "cancelada"],
  aceptada:   ["en_curso", "cancelada"],
  en_curso:   ["cerrada", "cancelada"],
  cerrada:    [],
  cancelada:  [],
};

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

async function validateFKs(
  pasajero_id: number,
  turno_id: number,
  tarifa_id: number
): Promise<{ status: number; message: string } | null> {
  const pasajero = await Pasajero.findByPk(pasajero_id);
  if (!pasajero) return { status: 404, message: `Pasajero with id=${pasajero_id} not found` };
  // pasajero no requiere estar active

  const turno = await Turno.findByPk(turno_id);
  if (!turno) return { status: 404, message: `Turno with id=${turno_id} not found` };
  if (turno.status !== "active") return { status: 400, message: `Turno with id=${turno_id} is inactive` };

  const tarifa = await Tarifa.findByPk(tarifa_id);
  if (!tarifa) return { status: 404, message: `Tarifa with id=${tarifa_id} not found` };
  if (tarifa.status !== "active") return { status: 400, message: `Tarifa with id=${tarifa_id} is inactive` };

  return null;
}

export class CarreraController {
  /** GET /api/carreras */
  public async getAll(req: Request, res: Response) {
    try {
      const carreras = await Carrera.findAll({
        include: [
          { association: "pasajero", attributes: ["id", "name"] },
          { association: "turno",    attributes: ["id", "nombre"] },
          { association: "tarifa",   attributes: ["id", "nombre", "valor_base"] },
        ],
      });
      res.status(200).json({ carreras });
    } catch (error) {
      res.status(500).json({ error: "Error fetching carreras", detail: String(error) });
    }
  }

  /** GET /api/carreras/:id */
  public async getOne(req: Request, res: Response) {
    try {
      const carrera = await Carrera.findByPk(paramId(req), {
        include: [
          { association: "pasajero", attributes: ["id", "name"] },
          { association: "turno",    attributes: ["id", "nombre"] },
          { association: "tarifa",   attributes: ["id", "nombre", "valor_base"] },
        ],
      });
      if (!carrera) { res.status(404).json({ error: "Carrera not found" }); return; }
      res.status(200).json({ carrera });
    } catch (error) {
      res.status(500).json({ error: "Error fetching carrera", detail: String(error) });
    }
  }

  /** POST /api/carreras */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as CarreraI;

      if (!body.pasajero_id || !body.turno_id || !body.tarifa_id) {
        res.status(400).json({ error: "pasajero_id, turno_id and tarifa_id are required" });
        return;
      }

      const fkError = await validateFKs(body.pasajero_id, body.turno_id, body.tarifa_id);
      if (fkError) { res.status(fkError.status).json({ error: fkError.message }); return; }

      // Fetch tarifa for total calculation
      const tarifa = await Tarifa.findByPk(body.tarifa_id);
      // Simplification: total = valor_base (no distance available yet)
      const total = Number(tarifa!.valor_base);

      const carrera = await Carrera.create({
        pasajero_id:    body.pasajero_id,
        turno_id:       body.turno_id,
        tarifa_id:      body.tarifa_id,
        fecha_inicio:   new Date(),
        fecha_fin:      null,
        total:          null,          // total se fija al cerrar
        estado:         "solicitada",  // SIEMPRE arranca en solicitada
        observaciones:  body.observaciones ?? null,
        liquidacion_id: null,
      });

      res.status(201).json({ carrera, nota: "total calculado al cerrar (total = tarifa.valor_base)" });
    } catch (error) {
      res.status(500).json({ error: "Error creating carrera", detail: String(error) });
    }
  }

  /** PATCH /api/carreras/:id/estado — única puerta para cambiar estado */
  public async cambiarEstado(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const { estado: nuevoEstado } = req.body as { estado: CarreraEstado };

      const carrera = await Carrera.findByPk(id);
      if (!carrera) { res.status(404).json({ error: "Carrera not found" }); return; }

      const allowed = TRANSITIONS[carrera.estado];
      if (!allowed.includes(nuevoEstado)) {
        res.status(409).json({
          error: `Invalid transition: '${carrera.estado}' → '${nuevoEstado}'. Allowed from '${carrera.estado}': [${allowed.join(", ")}]`,
        });
        return;
      }

      const updates: Partial<CarreraI> = { estado: nuevoEstado };

      if (nuevoEstado === "cerrada") {
        const tarifa = await Tarifa.findByPk(carrera.tarifa_id);
        updates.fecha_fin = new Date();
        updates.total = Number(tarifa!.valor_base); // simplificación documentada
      }

      await carrera.update(updates);
      res.status(200).json({ carrera });
    } catch (error) {
      res.status(500).json({ error: "Error changing estado", detail: String(error) });
    }
  }

  /** PATCH /api/carreras/:id — solo observaciones, NO estado/total/fechas */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const carrera = await Carrera.findByPk(id);
      if (!carrera) { res.status(404).json({ error: "Carrera not found" }); return; }

      // Solo permite editar observaciones
      await carrera.update({ observaciones: req.body.observaciones });
      res.status(200).json({ carrera });
    } catch (error) {
      res.status(500).json({ error: "Error updating carrera", detail: String(error) });
    }
  }

  /** DELETE /api/carreras/:id — borrado físico */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const carrera = await Carrera.findByPk(id);
      if (!carrera) { res.status(404).json({ error: "Carrera not found" }); return; }
      await carrera.destroy();
      res.status(200).json({ message: "Carrera permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting carrera", detail: String(error) });
    }
  }
}
