import { Request, Response } from "express";
import { Trip, TripStatus, TripI } from "./trip.model";
import { Passenger } from "../passenger/passenger.model";
import { Shift } from "../shift/shift.model";
import { Fare } from "../fare/fare.model";

/* ── Mapa de transiciones válidas ── */
const TRANSITIONS: Record<TripStatus, TripStatus[]> = {
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
  passenger_id: number,
  shift_id: number,
  fare_id: number
): Promise<{ status: number; message: string } | null> {
  const passenger = await Passenger.findByPk(passenger_id);
  if (!passenger) return { status: 404, message: `Passenger with id=${passenger_id} not found` };

  const shift = await Shift.findByPk(shift_id);
  if (!shift) return { status: 404, message: `Shift with id=${shift_id} not found` };
  if (shift.status !== "active") return { status: 400, message: `Shift with id=${shift_id} is inactive` };

  const fare = await Fare.findByPk(fare_id);
  if (!fare) return { status: 404, message: `Fare with id=${fare_id} not found` };
  if (fare.status !== "active") return { status: 400, message: `Fare with id=${fare_id} is inactive` };

  return null;
}

export class TripController {
  /** GET /api/carreras */
  public async getAll(req: Request, res: Response) {
    try {
      const trips = await Trip.findAll({
        include: [
          { association: "passenger", attributes: ["id", "name"] },
          { association: "shift",     attributes: ["id", "name"] },
          { association: "fare",      attributes: ["id", "name", "base_value"] },
        ],
      });
      res.status(200).json({ trips });
    } catch (error) {
      res.status(500).json({ error: "Error fetching trips", detail: String(error) });
    }
  }

  /** GET /api/carreras/:id */
  public async getOne(req: Request, res: Response) {
    try {
      const trip = await Trip.findByPk(paramId(req), {
        include: [
          { association: "passenger", attributes: ["id", "name"] },
          { association: "shift",     attributes: ["id", "name"] },
          { association: "fare",      attributes: ["id", "name", "base_value"] },
        ],
      });
      if (!trip) { res.status(404).json({ error: "Trip not found" }); return; }
      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: "Error fetching trip", detail: String(error) });
    }
  }

  /** POST /api/carreras */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TripI;

      if (!body.passenger_id || !body.shift_id || !body.fare_id) {
        res.status(400).json({ error: "passenger_id, shift_id and fare_id are required" });
        return;
      }

      const fkError = await validateFKs(body.passenger_id, body.shift_id, body.fare_id);
      if (fkError) { res.status(fkError.status).json({ error: fkError.message }); return; }

      const fare = await Fare.findByPk(body.fare_id);

      const trip = await Trip.create({
        passenger_id:  body.passenger_id,
        shift_id:      body.shift_id,
        fare_id:       body.fare_id,
        started_at:    new Date(),
        ended_at:      null,
        total:         null,          // total se fija al cerrar
        status:        "solicitada",  // SIEMPRE arranca en solicitada
        notes:         body.notes ?? null,
        settlement_id: null,
      });

      res.status(201).json({ trip, nota: "total calculado al cerrar (total = fare.base_value)" });
    } catch (error) {
      res.status(500).json({ error: "Error creating trip", detail: String(error) });
    }
  }

  /** PATCH /api/carreras/:id/estado — única puerta para cambiar estado */
  public async changeStatus(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const { status: newStatus } = req.body as { status: TripStatus };

      const trip = await Trip.findByPk(id);
      if (!trip) { res.status(404).json({ error: "Trip not found" }); return; }

      const allowed = TRANSITIONS[trip.status];
      if (!allowed.includes(newStatus)) {
        res.status(409).json({
          error: `Invalid transition: '${trip.status}' → '${newStatus}'. Allowed from '${trip.status}': [${allowed.join(", ")}]`,
        });
        return;
      }

      const updates: Partial<TripI> = { status: newStatus };

      if (newStatus === "cerrada") {
        const fare = await Fare.findByPk(trip.fare_id);
        updates.ended_at = new Date();
        updates.total = Number(fare!.base_value);
      }

      await trip.update(updates);
      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: "Error changing status", detail: String(error) });
    }
  }

  /** PATCH /api/carreras/:id — solo notas/observaciones */
  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trip = await Trip.findByPk(id);
      if (!trip) { res.status(404).json({ error: "Trip not found" }); return; }

      await trip.update({ notes: req.body.notes });
      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: "Error updating trip", detail: String(error) });
    }
  }

  /** DELETE /api/carreras/:id — borrado físico */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trip = await Trip.findByPk(id);
      if (!trip) { res.status(404).json({ error: "Trip not found" }); return; }
      await trip.destroy();
      res.status(200).json({ message: "Trip permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting trip", detail: String(error) });
    }
  }
}
