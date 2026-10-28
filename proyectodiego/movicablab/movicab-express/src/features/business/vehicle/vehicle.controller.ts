import { Request, Response } from "express";
import { Vehicle, VehicleI } from "./vehicle.model";
import { Company } from "../company/company.model";
import { VehicleType } from "../vehicle-type/vehicle-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

/**
 * Validates company_id: must exist and have status active.
 */
async function validateCompanyId(
  company_id: number
): Promise<{ status: number; message: string } | null> {
  const company = await Company.findByPk(company_id);
  if (!company) {
    return { status: 404, message: `Company with id=${company_id} not found` };
  }
  if (company.status !== "active") {
    return { status: 400, message: `Company with id=${company_id} is inactive` };
  }
  return null;
}

/**
 * Validates vehicle_type_id: if provided, must exist.
 */
async function validateVehicleTypeId(
  vehicle_type_id: number | null | undefined
): Promise<{ status: number; message: string } | null> {
  if (vehicle_type_id === null || vehicle_type_id === undefined) return null;
  const vtype = await VehicleType.findByPk(vehicle_type_id);
  if (!vtype) {
    return { status: 404, message: `VehicleType with id=${vehicle_type_id} not found` };
  }
  return null;
}

export class VehicleController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vehicles = await Vehicle.findAll({
        where: { status: "active" },
        include: [
          { association: "company", attributes: ["id", "tax_id", "legal_name"] },
          { association: "vehicle_type", attributes: ["id", "name"] },
        ],
      });
      res.status(200).json({ vehicles });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehicles", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle = await Vehicle.findByPk(id, {
        include: [
          { association: "company", attributes: ["id", "tax_id", "legal_name"] },
          { association: "vehicle_type", attributes: ["id", "name"] },
        ],
      });
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      res.status(200).json({ vehicle });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehicle", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VehicleI;

      if (!body.company_id) {
        res.status(400).json({ error: "company_id is required" });
        return;
      }

      const companyError = await validateCompanyId(body.company_id);
      if (companyError) {
        res.status(companyError.status).json({ error: companyError.message });
        return;
      }

      const vtypeError = await validateVehicleTypeId(body.vehicle_type_id);
      if (vtypeError) {
        res.status(vtypeError.status).json({ error: vtypeError.message });
        return;
      }

      const vehicle = await Vehicle.create({
        name: body.name,
        description: body.description ?? null,
        company_id: body.company_id,
        vehicle_type_id: body.vehicle_type_id ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ vehicle });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehicle", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VehicleI;
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }

      if (!body.company_id) {
        res.status(400).json({ error: "company_id is required" });
        return;
      }

      const companyError = await validateCompanyId(body.company_id);
      if (companyError) {
        res.status(companyError.status).json({ error: companyError.message });
        return;
      }

      const vtypeError = await validateVehicleTypeId(body.vehicle_type_id);
      if (vtypeError) {
        res.status(vtypeError.status).json({ error: vtypeError.message });
        return;
      }

      await vehicle.update({
        name: body.name,
        description: body.description ?? null,
        company_id: body.company_id,
        vehicle_type_id: body.vehicle_type_id ?? null,
        status: body.status ?? vehicle.status,
      });

      res.status(200).json({ vehicle });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehicle (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VehicleI>;
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }

      if ("company_id" in body && body.company_id !== undefined) {
        const companyError = await validateCompanyId(body.company_id!);
        if (companyError) {
          res.status(companyError.status).json({ error: companyError.message });
          return;
        }
      }

      if ("vehicle_type_id" in body) {
        const vtypeError = await validateVehicleTypeId(body.vehicle_type_id);
        if (vtypeError) {
          res.status(vtypeError.status).json({ error: vtypeError.message });
          return;
        }
      }

      await vehicle.update(body);
      res.status(200).json({ vehicle });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehicle (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      await vehicle.destroy();
      res.status(200).json({ message: "Vehicle permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehicle", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      await vehicle.update({ status: "inactive" });
      res.status(200).json({
        message: "Vehicle deactivated (logical delete)",
        vehicle,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehicle", detail: String(error) });
    }
  }
}
