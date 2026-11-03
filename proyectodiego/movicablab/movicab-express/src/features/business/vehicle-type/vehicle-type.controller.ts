import { Request, Response } from "express";
import { VehicleType, VehicleTypeI } from "./vehicle-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class VehicleTypeController {
  public async getAll(req: Request, res: Response) {
    try {
      const vehicle_types = await VehicleType.findAll({ where: { status: "active" } });
      res.status(200).json({ vehicle_types });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehicle types", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle_type = await VehicleType.findByPk(id);
      if (!vehicle_type) {
        res.status(404).json({ error: "VehicleType not found" });
        return;
      }
      res.status(200).json({ vehicle_type });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehicle type", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VehicleTypeI;
      const vehicle_type = await VehicleType.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "inactive",
      });
      res.status(201).json({ vehicle_type });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehicle type", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VehicleTypeI;
      const vehicle_type = await VehicleType.findByPk(id);
      if (!vehicle_type) {
        res.status(404).json({ error: "VehicleType not found" });
        return;
      }
      await vehicle_type.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? vehicle_type.status,
      });
      res.status(200).json({ vehicle_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehicle type (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VehicleTypeI>;
      const vehicle_type = await VehicleType.findByPk(id);
      if (!vehicle_type) {
        res.status(404).json({ error: "VehicleType not found" });
        return;
      }
      await vehicle_type.update(body);
      res.status(200).json({ vehicle_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehicle type (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle_type = await VehicleType.findByPk(id);
      if (!vehicle_type) {
        res.status(404).json({ error: "VehicleType not found" });
        return;
      }
      await vehicle_type.destroy();
      res.status(200).json({ message: "VehicleType permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehicle type", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle_type = await VehicleType.findByPk(id);
      if (!vehicle_type) {
        res.status(404).json({ error: "VehicleType not found" });
        return;
      }
      await vehicle_type.update({ status: "inactive" });
      res.status(200).json({ message: "VehicleType deactivated (logical delete)", vehicle_type });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehicle type", detail: String(error) });
    }
  }
}
