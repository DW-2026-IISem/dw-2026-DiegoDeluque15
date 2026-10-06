import { Request, Response } from "express";
import { Turno, TurnoI } from "./turno.model";
import { Conductor } from "../conductor/conductor.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function validateFKs(
  conductor_id: number,
  vehiculo_id: number
): Promise<{ status: number; message: string } | null> {
  const conductor = await Conductor.findByPk(conductor_id);
  if (!conductor) return { status: 404, message: `Conductor with id=${conductor_id} not found` };
  if (conductor.status !== "active") return { status: 400, message: `Conductor with id=${conductor_id} is inactive` };

  const vehiculo = await Vehiculo.findByPk(vehiculo_id);
  if (!vehiculo) return { status: 404, message: `Vehiculo with id=${vehiculo_id} not found` };
  if (vehiculo.status !== "active") return { status: 400, message: `Vehiculo with id=${vehiculo_id} is inactive` };

  return null;
}

async function checkUniqueness(
  conductor_id: number,
  vehiculo_id: number,
  exclude_turno_id?: number
): Promise<{ status: number; message: string } | null> {
  const whereConductor: any = { conductor_id, status: "active" };
  const whereVehiculo: any = { vehiculo_id, status: "active" };
  
  if (exclude_turno_id) {
    whereConductor.id = { [Op.ne]: exclude_turno_id };
    whereVehiculo.id = { [Op.ne]: exclude_turno_id };
  }

  const existingConductorTurno = await Turno.findOne({ where: whereConductor });
  if (existingConductorTurno) {
    return { status: 409, message: `Conductor ${conductor_id} is already in an active turno (id=${existingConductorTurno.id})` };
  }

  const existingVehiculoTurno = await Turno.findOne({ where: whereVehiculo });
  if (existingVehiculoTurno) {
    return { status: 409, message: `Vehiculo ${vehiculo_id} is already in an active turno (id=${existingVehiculoTurno.id})` };
  }

  return null;
}

export class TurnoController {
  public async getAll(req: Request, res: Response) {
    try {
      const turnos = await Turno.findAll({
        where: { status: "active" },
        include: [
          { association: "conductor", attributes: ["id", "nombre"] },
          { association: "vehiculo", attributes: ["id", "nombre", "empresa_id"] },
        ],
      });
      res.status(200).json({ turnos });
    } catch (error) {
      res.status(500).json({ error: "Error fetching turnos", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const turno = await Turno.findByPk(id, {
        include: [
          { association: "conductor", attributes: ["id", "nombre"] },
          { association: "vehiculo", attributes: ["id", "nombre", "empresa_id"] },
        ],
      });
      if (!turno) {
        res.status(404).json({ error: "Turno not found" });
        return;
      }
      res.status(200).json({ turno });
    } catch (error) {
      res.status(500).json({ error: "Error fetching turno", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TurnoI;

      if (!body.conductor_id || !body.vehiculo_id) {
        res.status(400).json({ error: "conductor_id and vehiculo_id are required" });
        return;
      }

      const fkError = await validateFKs(body.conductor_id, body.vehiculo_id);
      if (fkError) {
        res.status(fkError.status).json({ error: fkError.message });
        return;
      }

      if (body.status !== "inactive") {
        const uniqueError = await checkUniqueness(body.conductor_id, body.vehiculo_id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      const turno = await Turno.create({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        conductor_id: body.conductor_id,
        vehiculo_id: body.vehiculo_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ turno });
    } catch (error) {
      res.status(500).json({ error: "Error creating turno", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TurnoI;
      const turno = await Turno.findByPk(id);
      if (!turno) {
        res.status(404).json({ error: "Turno not found" });
        return;
      }

      if (!body.conductor_id || !body.vehiculo_id) {
        res.status(400).json({ error: "conductor_id and vehiculo_id are required" });
        return;
      }

      const fkError = await validateFKs(body.conductor_id, body.vehiculo_id);
      if (fkError) {
        res.status(fkError.status).json({ error: fkError.message });
        return;
      }

      const finalStatus = body.status ?? turno.status;
      if (finalStatus === "active") {
        const uniqueError = await checkUniqueness(body.conductor_id, body.vehiculo_id, id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      await turno.update({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        conductor_id: body.conductor_id,
        vehiculo_id: body.vehiculo_id,
        status: finalStatus,
      });

      res.status(200).json({ turno });
    } catch (error) {
      res.status(500).json({ error: "Error updating turno (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TurnoI>;
      const turno = await Turno.findByPk(id);
      if (!turno) {
        res.status(404).json({ error: "Turno not found" });
        return;
      }

      const finalConductorId = body.conductor_id !== undefined ? body.conductor_id : turno.conductor_id;
      const finalVehiculoId = body.vehiculo_id !== undefined ? body.vehiculo_id : turno.vehiculo_id;
      const finalStatus = body.status !== undefined ? body.status : turno.status;

      if (body.conductor_id !== undefined || body.vehiculo_id !== undefined) {
        const fkError = await validateFKs(finalConductorId, finalVehiculoId);
        if (fkError) {
          res.status(fkError.status).json({ error: fkError.message });
          return;
        }
      }

      if (finalStatus === "active") {
        const uniqueError = await checkUniqueness(finalConductorId, finalVehiculoId, id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      await turno.update(body);
      res.status(200).json({ turno });
    } catch (error) {
      res.status(500).json({ error: "Error updating turno (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const turno = await Turno.findByPk(id);
      if (!turno) {
        res.status(404).json({ error: "Turno not found" });
        return;
      }
      await turno.destroy();
      res.status(200).json({ message: "Turno permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting turno", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const turno = await Turno.findByPk(id);
      if (!turno) {
        res.status(404).json({ error: "Turno not found" });
        return;
      }
      await turno.update({ status: "inactive" });
      res.status(200).json({
        message: "Turno deactivated (logical delete)",
        turno,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating turno", detail: String(error) });
    }
  }
}
