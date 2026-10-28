import { Request, Response } from "express";
import { Shift, ShiftI } from "./shift.model";
import { Driver } from "../driver/driver.model";
import { Vehicle } from "../vehicle/vehicle.model";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function validateFKs(
  driver_id: number,
  vehicle_id: number
): Promise<{ status: number; message: string } | null> {
  const driver = await Driver.findByPk(driver_id);
  if (!driver) return { status: 404, message: `Driver with id=${driver_id} not found` };
  if (driver.status !== "active") return { status: 400, message: `Driver with id=${driver_id} is inactive` };

  const vehicle = await Vehicle.findByPk(vehicle_id);
  if (!vehicle) return { status: 404, message: `Vehicle with id=${vehicle_id} not found` };
  if (vehicle.status !== "active") return { status: 400, message: `Vehicle with id=${vehicle_id} is inactive` };

  return null;
}

async function checkUniqueness(
  driver_id: number,
  vehicle_id: number,
  exclude_shift_id?: number
): Promise<{ status: number; message: string } | null> {
  const whereDriver: any = { driver_id, status: "active" };
  const whereVehicle: any = { vehicle_id, status: "active" };

  if (exclude_shift_id) {
    whereDriver.id = { [Op.ne]: exclude_shift_id };
    whereVehicle.id = { [Op.ne]: exclude_shift_id };
  }

  const existingDriverShift = await Shift.findOne({ where: whereDriver });
  if (existingDriverShift) {
    return { status: 409, message: `Driver ${driver_id} is already in an active shift (id=${existingDriverShift.id})` };
  }

  const existingVehicleShift = await Shift.findOne({ where: whereVehicle });
  if (existingVehicleShift) {
    return { status: 409, message: `Vehicle ${vehicle_id} is already in an active shift (id=${existingVehicleShift.id})` };
  }

  return null;
}

export class ShiftController {
  public async getAll(req: Request, res: Response) {
    try {
      const shifts = await Shift.findAll({
        where: { status: "active" },
        include: [
          { association: "driver", attributes: ["id", "name"] },
          { association: "vehicle", attributes: ["id", "name", "company_id"] },
        ],
      });
      res.status(200).json({ shifts });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shifts", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shift = await Shift.findByPk(id, {
        include: [
          { association: "driver", attributes: ["id", "name"] },
          { association: "vehicle", attributes: ["id", "name", "company_id"] },
        ],
      });
      if (!shift) {
        res.status(404).json({ error: "Shift not found" });
        return;
      }
      res.status(200).json({ shift });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shift", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ShiftI;

      if (!body.driver_id || !body.vehicle_id) {
        res.status(400).json({ error: "driver_id and vehicle_id are required" });
        return;
      }

      const fkError = await validateFKs(body.driver_id, body.vehicle_id);
      if (fkError) {
        res.status(fkError.status).json({ error: fkError.message });
        return;
      }

      if (body.status !== "inactive") {
        const uniqueError = await checkUniqueness(body.driver_id, body.vehicle_id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      const shift = await Shift.create({
        name: body.name,
        description: body.description ?? null,
        driver_id: body.driver_id,
        vehicle_id: body.vehicle_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ shift });
    } catch (error) {
      res.status(500).json({ error: "Error creating shift", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ShiftI;
      const shift = await Shift.findByPk(id);
      if (!shift) {
        res.status(404).json({ error: "Shift not found" });
        return;
      }

      if (!body.driver_id || !body.vehicle_id) {
        res.status(400).json({ error: "driver_id and vehicle_id are required" });
        return;
      }

      const fkError = await validateFKs(body.driver_id, body.vehicle_id);
      if (fkError) {
        res.status(fkError.status).json({ error: fkError.message });
        return;
      }

      const finalStatus = body.status ?? shift.status;
      if (finalStatus === "active") {
        const uniqueError = await checkUniqueness(body.driver_id, body.vehicle_id, id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      await shift.update({
        name: body.name,
        description: body.description ?? null,
        driver_id: body.driver_id,
        vehicle_id: body.vehicle_id,
        status: finalStatus,
      });

      res.status(200).json({ shift });
    } catch (error) {
      res.status(500).json({ error: "Error updating shift (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ShiftI>;
      const shift = await Shift.findByPk(id);
      if (!shift) {
        res.status(404).json({ error: "Shift not found" });
        return;
      }

      const finalDriverId = body.driver_id !== undefined ? body.driver_id : shift.driver_id;
      const finalVehicleId = body.vehicle_id !== undefined ? body.vehicle_id : shift.vehicle_id;
      const finalStatus = body.status !== undefined ? body.status : shift.status;

      if (body.driver_id !== undefined || body.vehicle_id !== undefined) {
        const fkError = await validateFKs(finalDriverId, finalVehicleId);
        if (fkError) {
          res.status(fkError.status).json({ error: fkError.message });
          return;
        }
      }

      if (finalStatus === "active") {
        const uniqueError = await checkUniqueness(finalDriverId, finalVehicleId, id);
        if (uniqueError) {
          res.status(uniqueError.status).json({ error: uniqueError.message });
          return;
        }
      }

      await shift.update(body);
      res.status(200).json({ shift });
    } catch (error) {
      res.status(500).json({ error: "Error updating shift (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shift = await Shift.findByPk(id);
      if (!shift) {
        res.status(404).json({ error: "Shift not found" });
        return;
      }
      await shift.destroy();
      res.status(200).json({ message: "Shift permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting shift", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shift = await Shift.findByPk(id);
      if (!shift) {
        res.status(404).json({ error: "Shift not found" });
        return;
      }
      await shift.update({ status: "inactive" });
      res.status(200).json({
        message: "Shift deactivated (logical delete)",
        shift,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating shift", detail: String(error) });
    }
  }
}
